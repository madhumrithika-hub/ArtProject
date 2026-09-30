const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const Tutorial = require('../models/Tutorial');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');
const { processArtImage } = require('../services/imageAnalysis');
const { generateArtTutorial } = require('../services/geminiService');

/**
 * @route   POST /api/tutorials/generate
 * @desc    Upload art image/video & generate full step-by-step guidance
 */
router.post('/generate', authMiddleware, upload.single('visual'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload an image or video file of the art piece.' });
    }

    const {
      description = '',
      originalMedium = 'Oil Painting',
      targetMedium = 'Watercolor',
      subjectType = 'Portrait',
    } = req.body;

    const filePath = req.file.path;
    const fileUrl = `/uploads/${req.file.filename}`;

    console.log(`[Tutorials] Processing visual: ${req.file.filename} (Original: ${originalMedium} -> Target: ${targetMedium})`);

    // 1. Image processing: Edge wireframe, value study, and pigment palette extraction
    const imageAnalysis = await processArtImage(filePath, req.file.filename);

    // 2. Artistic decomposition via Gemini AI / Fine-Art Engine
    const tutorialData = await generateArtTutorial({
      imagePath: filePath,
      originalMedium,
      targetMedium,
      description,
      subjectType,
    });

    // Merge stage visual overlays into generated stages
    const enrichedStages = (tutorialData.stages || []).map((stage, idx) => {
      let layerVisualUrl = fileUrl;
      // Step 1 & 2 show the structural wireframe outline
      if (idx === 0 || idx === 1) {
        layerVisualUrl = imageAnalysis.wireframeUrl || fileUrl;
      }
      // Step 3 shows the tonal value study
      else if (idx === 2) {
        layerVisualUrl = imageAnalysis.valueStudyUrl || fileUrl;
      }
      // Steps 4, 5, 6 show the full color rendering & original visual
      else {
        layerVisualUrl = fileUrl;
      }

      return {
        ...stage,
        layerVisualUrl,
      };
    });

    // 3. Save tutorial to MongoDB for the registered user
    const newTutorial = new Tutorial({
      userId: req.user.user_id,
      title: tutorialData.title || `Mastering ${targetMedium} Tutorial`,
      description: description || `Transforming ${originalMedium} into ${targetMedium}`,
      originalMedium,
      targetMedium,
      subjectType,
      originalImageUrl: fileUrl,
      wireframeUrl: imageAnalysis.wireframeUrl,
      valueStudyUrl: imageAnalysis.valueStudyUrl,
      colorPalette: imageAnalysis.colorPalette,
      suppliesNeeded: Array.isArray(tutorialData.suppliesNeeded) ? tutorialData.suppliesNeeded : [],
      stages: enrichedStages,
    });

    await newTutorial.save();
    console.log(`[Tutorials] Saved tutorial with ID: ${newTutorial._id} for user ${req.user.user_id}`);

    return res.status(201).json({
      message: 'Tutorial successfully generated and saved to your studio!',
      tutorial: newTutorial,
    });
  } catch (error) {
    console.error('[Tutorials] Generate error:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate tutorial.' });
  }
});

/**
 * @route   GET /api/tutorials
 * @desc    Fetch all saved tutorials for the authenticated user
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const tutorials = await Tutorial.find({ userId: req.user.user_id }).sort({ createdAt: -1 });
    return res.json({ tutorials });
  } catch (error) {
    console.error('[Tutorials] Fetch error:', error);
    return res.status(500).json({ error: 'Failed to fetch tutorials.' });
  }
});

/**
 * @route   GET /api/tutorials/:id
 * @desc    Fetch a single tutorial by ID
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const tutorial = await Tutorial.findById(req.params.id);
    if (!tutorial) {
      return res.status(404).json({ error: 'Tutorial not found.' });
    }

    // Verify ownership
    if (tutorial.userId !== req.user.user_id) {
      return res.status(403).json({ error: 'You do not have permission to view this artwork.' });
    }

    return res.json({ tutorial });
  } catch (error) {
    console.error('[Tutorials] Fetch single error:', error);
    return res.status(500).json({ error: 'Failed to fetch tutorial details.' });
  }
});

/**
 * @route   POST /api/tutorials/:id/save-drawing
 * @desc    Save the user's canvas drawing / practice work to this tutorial
 */
router.post('/:id/save-drawing', authMiddleware, async (req, res) => {
  try {
    const { canvasData, previewDataUrl } = req.body;
    const tutorial = await Tutorial.findById(req.params.id);

    if (!tutorial) {
      return res.status(404).json({ error: 'Tutorial not found.' });
    }

    if (tutorial.userId !== req.user.user_id) {
      return res.status(403).json({ error: 'Unauthorized.' });
    }

    tutorial.savedDrawing = {
      canvasData: canvasData || '',
      previewUrl: previewDataUrl || '',
      updatedAt: new Date(),
    };

    await tutorial.save();

    return res.json({
      message: 'Your drawing work has been successfully saved to your profile!',
      savedDrawing: tutorial.savedDrawing,
    });
  } catch (error) {
    console.error('[Tutorials] Save drawing error:', error);
    return res.status(500).json({ error: 'Failed to save drawing work.' });
  }
});

/**
 * @route   DELETE /api/tutorials/:id
 * @desc    Delete a tutorial and its associated files
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const tutorial = await Tutorial.findById(req.params.id);
    if (!tutorial) {
      return res.status(404).json({ error: 'Tutorial not found.' });
    }

    if (tutorial.userId !== req.user.user_id) {
      return res.status(403).json({ error: 'Unauthorized.' });
    }

    await Tutorial.findByIdAndDelete(req.params.id);
    return res.json({ message: 'Tutorial removed successfully from your studio.' });
  } catch (error) {
    console.error('[Tutorials] Delete error:', error);
    return res.status(500).json({ error: 'Failed to delete tutorial.' });
  }
});

module.exports = router;
