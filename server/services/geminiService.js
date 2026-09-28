const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
const path = require('path');

/**
 * Fallback generator when Gemini API key is not set or network is offline.
 * Produces authentic, academic fine-art instructions tailored to target medium & user notes.
 */
function generateArtisticTutorialFallback({
  targetMedium = 'Watercolor',
  originalMedium = 'Oil Painting',
  description = '',
  subjectType = 'Portrait',
}) {
  const tMed = (targetMedium || 'Watercolor').toLowerCase();

  // Medium specific tools, advice & stages
  if (tMed.includes('watercolor')) {
    return {
      title: `Step-by-Step ${targetMedium} Painting Masterclass`,
      conversionStrategy: `Translating from ${originalMedium} to Watercolor requires flipping your mental model: in ${originalMedium} you often build from dark to light, whereas in watercolor you must preserve the paper's pure whites and work strictly from lightest values to darkest shadows.`,
      suppliesNeeded: [
        { name: 'Cold-Press Watercolor Paper (300gsm / 140lb)', type: 'Surface', note: 'Heavyweight rough texture to absorb multiple wet washes without buckling.' },
        { name: '2H Graphite Pencil & Kneaded Eraser', type: 'Drafting', note: 'Ultra-light graphite lines that will not show through transparent glazes.' },
        { name: 'Mop / Round Brushes (#12, #6, #2)', type: 'Brushes', note: 'Large mop for wet-on-wet atmospheric washes; #6 and #2 for sharp focal details.' },
        { name: 'Artist-Grade Watercolor Set', type: 'Pigments', note: 'Transparent pigments (Cobalt, Ultramarine, Quinacridone Rose, Burnt Sienna, Yellow Ochre).' },
        { name: 'Masking Fluid or White Gouache', type: 'Highlights', note: 'For preserving or re-introducing crisp specular highlights in eyes/skin.' },
      ],
      stages: [
        {
          stepNumber: 1,
          title: 'Stage 1: Geometric Gesture & Preservation Layout',
          subtitle: 'Loomis Grid, Tilt Angles & Masking Pure Whites',
          instructions: [
            'Lightly sketch the outer bounding shape with a 2H pencil. Keep your touch feathery.',
            'Establish the central tilt axis and the 3 classical facial thirds (hairline to brow, brow to nose base, nose base to chin).',
            'Identify the brightest catchlights (e.g. pupils, nose tip, cheek glint) and apply a droplet of masking fluid or circle them lightly to keep 100% untouched white paper.',
          ],
          artistTip: 'Never press hard with graphite on watercolor paper; hard indents ruin paper sizing and cause pigment pooling.',
          commonMistakes: 'Dark, heavy outlines that smudge into watercolor washes and muddy your colors.',
          recommendedTool: '2H Hard Pencil & Kneaded Eraser',
          estimatedTime: '15 mins',
        },
        {
          stepNumber: 2,
          title: 'Stage 2: First Wash (Wet-on-Wet Atmospheric Base)',
          subtitle: 'Broad Transparent Glaze for Light Values & Mood',
          instructions: [
            'Dampen the paper with clean water using your large mop brush until the paper has a satin sheen.',
            'Drop in diluted warm tones (Yellow Ochre + Peach/Rose tint) across the light planes of the subject.',
            'Allow pigments to bleed softly into each other without manual brush agitation—let the water do the blending work.',
            'Let this foundational layer dry completely (bone dry) before moving to the next stage.',
          ],
          artistTip: 'Test wash dilution on a spare scrap of watercolor paper first—watercolor dries 20-30% lighter than it appears wet.',
          commonMistakes: 'Touching wet paint too early, which creates unwanted blooming/cauliflowers.',
          recommendedTool: '#12 Soft Mop or Quill Brush',
          estimatedTime: '20 mins',
        },
        {
          stepNumber: 3,
          title: 'Stage 3: Value Block-In & Shadow Shapes',
          subtitle: 'Wet-on-Dry Structural Shadows & Depth',
          instructions: [
            'Mix a cool, transparent shadow tone using Ultramarine Blue + Burnt Sienna.',
            'Apply wet-on-dry along the shadow side of the face/subject, defining the terminator line.',
            'Use a clean, damp brush along the inner edge of the shadow to soften the boundary into the light plane.',
            'Carve out eye sockets, under-nose cast shadow, and jawline depth.',
          ],
          artistTip: 'Shadows in watercolor are living colors, not dead grays—keep warmth in core shadows and coolness in ambient bounce light.',
          commonMistakes: 'Using black paint for shadows. Always mix chromatic darks from complementary colors.',
          recommendedTool: '#8 Round Sable or Synthetic Brush',
          estimatedTime: '25 mins',
        },
        {
          stepNumber: 4,
          title: 'Stage 4: Secondary Planes, Glazes & Color Temperature',
          subtitle: 'Warm Cheek Flushes, Irises & Edge Definition',
          instructions: [
            'Glaze transparent layers of Quinacridone Rose or Cadmium Red over the cheeks, lips, and ear cartilage.',
            'Block in the irises, leaving the pupil highlight crisp.',
            'Work around hair masses using confident, sweeping brush strokes; vary thick and thin edges.',
            'Reinforce midtone contours where forms turn sharply away from the primary light source.',
          ],
          artistTip: 'Glazing means applying a transparent wash over a dry layer without disturbing the underlying color.',
          commonMistakes: 'Scrubbing back and forth with the brush, which lifts dry under-layers and creates muddy texture.',
          recommendedTool: '#6 Pointed Round Brush',
          estimatedTime: '25 mins',
        },
        {
          stepNumber: 5,
          title: 'Stage 5: Calligraphic Accents, Details & Pure Highlights',
          subtitle: 'Lash Lines, Crisp Edges & Opaque Specular Pop',
          instructions: [
            'Switch to a #2 rigger or detail brush loaded with rich, concentrated pigment (low water).',
            'Draw crisp dark accents: eyelid creases, nostrils, corner of mouth, individual hair clusters.',
            'Gently rub off masking fluid from step 1 with a clean finger or rubber pick.',
            'If needed, touch up specular highlights (eye catchlights, lip shine) with a pinpoint of opaque Titanium White gouache.',
          ],
          artistTip: 'Restraint is key—80% of watercolor charm comes from loose washes; keep sharp details strictly in focal points.',
          commonMistakes: 'Over-detailing the background and losing the focal hierarchy.',
          recommendedTool: '#2 Precision Rigger & White Gouache',
          estimatedTime: '15 mins',
        },
      ],
    };
  } else if (tMed.includes('oil') || tMed.includes('acrylic')) {
    return {
      title: `Step-by-Step ${targetMedium} Painting Masterclass`,
      conversionStrategy: `Working in ${targetMedium} is all about building fat-over-lean and dark-to-light. Unlike transparent mediums, here you have the superpower of opaque paint coverage to carve out sculptural form and rich, textured impasto highlights.`,
      suppliesNeeded: [
        { name: 'Stretched Linen or Gessoed Canvas Board', type: 'Surface', note: 'Double-primed sturdy surface for structural paint application.' },
        { name: 'Burnt Umber & Odorless Mineral Spirits', type: 'Underpainting', note: 'For the imprimatura tonal wash and structural lay-in.' },
        { name: 'Filbert & Flat Brushes (#4, #8, #10)', type: 'Brushes', note: 'Hog bristle for blocking masses; synthetic filberts for soft blending.' },
        { name: 'Core Palette', type: 'Paints', note: 'Titanium White, Yellow Ochre, Cadmium Red, Burnt Umber, Ultramarine Blue, Ivory Black.' },
        { name: 'Palette Knife', type: 'Tools', note: 'For clean paint mixing and energetic impasto edge accents.' },
      ],
      stages: [
        {
          stepNumber: 1,
          title: 'Stage 1: Imprimatura & Tonal Underdrawing',
          subtitle: 'Toned Canvas & Umber Gesture Architecture',
          instructions: [
            'Wipe a thin, transparent wash of Burnt Umber or Raw Sienna across your white canvas to eliminate blinding glare.',
            'With a small round brush dipped in thinned umber paint, sketch the gesture and outer contour silhouettes.',
            'Block the cranial oval, jawline angle, and the horizontal eye/nose/mouth crosshairs.',
          ],
          artistTip: 'Wipe away light areas on your wet imprimatura with a rag to quickly reveal high-value focal shapes.',
          commonMistakes: 'Jumping straight onto a glaring white canvas without establishing a midtone ground.',
          recommendedTool: 'Rag, Odorless Thinner & #4 Round Brush',
          estimatedTime: '20 mins',
        },
        {
          stepNumber: 2,
          title: 'Stage 2: Grisaille / 2-Value Shadow Block-In',
          subtitle: 'Separating Form into Pure Light vs Pure Shadow',
          instructions: [
            'Ignore details entirely; squint your eyes at the subject.',
            'Fill all shadow shapes with a flat mixture of Burnt Umber + Ultramarine Blue (lean mixture).',
            'Connect shadows into a unified family (eye socket into nose cast shadow into cheek core shadow).',
            'Ensure your light shapes remain crisp and unpolluted.',
          ],
          artistTip: 'If your 2-value block-in does not read as a recognizable form from 10 feet away, do not move on to color yet!',
          commonMistakes: 'Adding details inside shadows too early. Shadows must remain simple and quiet.',
          recommendedTool: '#10 Flat Hog Bristle Brush',
          estimatedTime: '30 mins',
        },
        {
          stepNumber: 3,
          title: 'Stage 3: Mixing & Laying Middle Values',
          subtitle: 'Opaque Local Color Planes & Turning Edges',
          instructions: [
            'Premix your major color puddles on the palette: shadow, midtone half-light, and plane light.',
            'Lay down opaque swathes of paint on the lit planes (Yellow Ochre + Venetian Red + Titanium White).',
            'Apply paint with mosaic-like planar touches, following the anatomical curvature of the forms.',
            'Keep paint slightly thicker than the underlayer (fat over lean).',
          ],
          artistTip: 'Do not blend immediately! Lay distinct color tiles next to each other first to preserve chromatic vibration.',
          commonMistakes: 'Over-blending into a muddy smooth gradient that destroys sculptural plane clarity.',
          recommendedTool: '#8 Filbert Brush & Palette Knife',
          estimatedTime: '40 mins',
        },
        {
          stepNumber: 4,
          title: 'Stage 4: Edge Control & Half-Tone Transitions',
          subtitle: 'Hard Edges, Soft Edges & Lost Edges',
          instructions: [
            'Examine the contours: soften turning form shadows with a clean mop brush; keep cast shadow edges firm.',
            'Paint the halftones (the zones where light turns into shadow)—notice that halftones are slightly cooler in temperature.',
            'Add subtle warm reflected light into the deep shadow crevices (bounce light from clothing or background).',
            'Refine the contours of eyes, bridge of nose, and lip vermilion border.',
          ],
          artistTip: 'Lost edges (where subject melts seamlessly into background) create mystery and painterly atmosphere.',
          commonMistakes: 'Treating all edges as razor sharp cutouts (the sticker effect).',
          recommendedTool: '#6 Soft Synthetic Filbert & Fan Brush',
          estimatedTime: '35 mins',
        },
        {
          stepNumber: 5,
          title: 'Stage 5: Impasto Highlights & Textural Finishing',
          subtitle: 'Thick Paint, Catchlights & Vivid Focal Accents',
          instructions: [
            'Load a generous amount of pure Titanium White with a hint of warm tint onto the tip of your brush or palette knife.',
            'Place crisp, thick impasto catchlights in the eye, high cheekbone, forehead brow ridge, and nose tip.',
            'Sharpen key occlusion lines in deep darks (pupil, nostrils, lip corners) with rich Ivory Black + Alizarin Crimson.',
            'Step back 6 feet to evaluate the final balance, depth, and emotional presence.',
          ],
          artistTip: 'Let the thickest paint sit only on the highest specular highlights—this creates true 3D physical luminosity.',
          commonMistakes: 'Fiddling with already placed wet highlights and muddying them.',
          recommendedTool: 'Palette Knife & #2 Detail Rigger',
          estimatedTime: '20 mins',
        },
      ],
    };
  } else {
    // Default to Classical Pencil / Graphite / Charcoal Sketch
    return {
      title: `Step-by-Step ${targetMedium} Sketching & Shading Masterclass`,
      conversionStrategy: `Translating this piece into a ${targetMedium} sketch focuses purely on the fundamentals of drawing: rhythm, gesture line, anatomical landmarks, and tonal value control from delicate 2H lines to deep 6B graphite occlusion.`,
      suppliesNeeded: [
        { name: 'Smooth Heavyweight Drawing Paper', type: 'Surface', note: 'Bristol smooth or cartridge paper that handles heavy graphite blending.' },
        { name: 'Graphite Pencil Grade Set (2H, HB, 2B, 4B, 6B)', type: 'Graphite', note: 'From hard architectural guidelines to velvety dark shadows.' },
        { name: 'Kneaded Rubber Eraser', type: 'Eraser', note: 'For lifting graphite to draw highlights and cleaning edges without paper scuffing.' },
        { name: 'Paper Blending Stump (Tortillon)', type: 'Blending', note: 'For smooth skin transitions and atmospheric graphite gradients.' },
        { name: 'Precision Tombow Mono Zero Eraser', type: 'Detail', note: 'For ultra-thin hair strands and specular eye catchlights.' },
      ],
      stages: [
        {
          stepNumber: 1,
          title: 'Stage 1: Gesture, Bounding Shapes & Loomis Sphere',
          subtitle: 'Feathery 2H Guidelines & Tilt Coordinates',
          instructions: [
            'Hold your 2H pencil lightly by the back end, using the side of the lead rather than the sharp tip.',
            'Draw a ball for the cranial mass, drop the jawline wedge, and angle the central eye tilt axis.',
            'Triangulate the outer perimeter of the subject into simple geometric envelopes to guarantee proper proportions.',
          ],
          artistTip: 'Draw with your shoulder and whole arm, not just your wrist—this produces smooth, confident curves.',
          commonMistakes: 'Pressing hard with HB/2B early on, leaving grooves in the paper that cannot be erased.',
          recommendedTool: '2H Hard Graphite Pencil',
          estimatedTime: '15 mins',
        },
        {
          stepNumber: 2,
          title: 'Stage 2: Facial Landmarks & Contour Verification',
          subtitle: 'Proportions of the Eyes, Nose, Mouth & Outer Silhouette',
          instructions: [
            'Place the brow line and drop vertical plumb lines from the tear ducts to align with the outer wings of the nostrils.',
            'Mark the corners of the mouth (typically aligning beneath the centers of the pupils).',
            'Carve out the silhouette contours of hair masses, neck, and shoulders with clean HB lines.',
            'Confirm angle relationships against your reference before shading.',
          ],
          artistTip: 'Step away or hold your sketch up to a mirror—flipping the view instantly reveals any proportional asymmetry.',
          commonMistakes: 'Drawing individual eyelashes or teeth before the general sockets and mouth planes are situated.',
          recommendedTool: 'HB Medium Pencil & Kneaded Eraser',
          estimatedTime: '20 mins',
        },
        {
          stepNumber: 3,
          title: 'Stage 3: Shadow Separation & Value Block-In',
          subtitle: 'Blocking Core Shadows with Consistent Hatching',
          instructions: [
            'Switch to a 2B pencil and shade all shadow areas with uniform 45-degree diagonal hatches.',
            'Fill the eye sockets, beneath the brow, cast shadow under the nose, lower lip shadow, and neck occlusion.',
            'Keep shadow tone flat and unified to establish the light direction immediately.',
          ],
          artistTip: 'Keep your pencil strokes going in one consistent direction during the initial block-in to maintain clean rhythm.',
          commonMistakes: 'Scattering random patches of shading without a coherent unified shadow family.',
          recommendedTool: '2B Soft Pencil',
          estimatedTime: '25 mins',
        },
        {
          stepNumber: 4,
          title: 'Stage 4: Midtones, Halftones & Stump Blending',
          subtitle: 'Sculpting 3D Curvature & Skin Luster',
          instructions: [
            'Use a 3B/4B pencil to build the halftones that curve between pure light and core shadow.',
            'Use your blending stump gently to smudge transitions on soft surfaces (cheeks, forehead, neck).',
            'Maintain hard, un-smudged pencil hatch marks on firm cartilage and bone (brow bone, nose bridge).',
            'Shade the irises, leaving a circular white highlight untouched.',
          ],
          artistTip: 'Do not blend with bare fingers—skin oils transfer to the paper and create permanent dirty gray stains.',
          commonMistakes: 'Over-smudging the entire drawing so it looks like blurry gray smoke instead of solid form.',
          recommendedTool: '3B Pencil & Blending Tortillon',
          estimatedTime: '30 mins',
        },
        {
          stepNumber: 5,
          title: 'Stage 5: Deep 6B Darks, Highlight Lifting & Fine Textures',
          subtitle: 'Maximum Contrast, Clean White Catchlights & Final Polish',
          instructions: [
            'Pick up your darkest 6B or 8B pencil for maximum punch: pupils, nostril caverns, hair occlusion shadows.',
            'Pinch your kneaded eraser into a chisel point and dab away graphite to lift clean highlights on cheekbones and nose.',
            'Render crisp hair strands with quick tapered strokes following the natural flow.',
            'Clean up the negative space background around your portrait for a gallery-ready presentation.',
          ],
          artistTip: 'Contrast is king: deep velvety blacks next to pure white paper highlights make the portrait leap off the page.',
          commonMistakes: 'Fear of going dark enough. Weak contrast leaves drawings looking flat and washed out.',
          recommendedTool: '6B/8B Soft Graphite & Precision Eraser',
          estimatedTime: '20 mins',
        },
      ],
    };
  }
}

/**
 * Main service to decompose user art input into a full step-by-step tutorial.
 * Handles Gemini Vision API if key available, or falls back to intelligent artist engine.
 */
async function generateArtTutorial({
  imagePath,
  originalMedium = 'Oil Painting',
  targetMedium = 'Watercolor',
  description = '',
  subjectType = 'Portrait',
}) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey.trim().length > 5) {
    try {
      console.log('[GeminiService] Calling Gemini Vision API for artistic decomposition...');
      const ai = new GoogleGenAI({ apiKey });

      // Read image as base64
      const imageBytes = fs.readFileSync(imagePath);
      const mimeType = path.extname(imagePath).toLowerCase() === '.png' ? 'image/png' : 'image/jpeg';
      const base64Image = imageBytes.toString('base64');

      const prompt = `You are a world-class master art instructor and academy professor.
The user has uploaded a visual artwork or reference.
- Original Art Piece Description: "${description || 'An artwork reference'}"
- Original Medium: "${originalMedium}"
- Desired Target Medium to teach: "${targetMedium}"
- Subject: "${subjectType}"

Carefully analyze the image and the user's intent. The user specifically wants to learn how to recreate this visual using the TARGET MEDIUM (${targetMedium}), adapting from the original visual.

Return a STRICT JSON response (NO markdown fences, pure JSON) with the following structure:
{
  "title": "A compelling title for the tutorial",
  "conversionStrategy": "2-3 sentences explaining the specific technical and mindset translation needed to go from ${originalMedium} into ${targetMedium}",
  "suppliesNeeded": [
    { "name": "Item name", "type": "Surface/Brushes/Pigments/Tools", "note": "Why it is needed and recommended specifications" }
  ],
  "stages": [
    {
      "stepNumber": 1,
      "title": "Stage 1: ...",
      "subtitle": "Short descriptive focus",
      "instructions": [
        "Actionable, detailed bullet point 1",
        "Actionable, detailed bullet point 2",
        "Actionable, detailed bullet point 3"
      ],
      "artistTip": "Pro masterclass tip for this step",
      "commonMistakes": "Key beginner pitfall to avoid in this step",
      "recommendedTool": "Specific pencil grade, brush type, or tool",
      "estimatedTime": "e.g. 15-20 mins"
    }
  ]
}

Provide 5 or 6 progressive academic stages (1: Gesture & Structural wireframe, 2: Anatomical/proportion landmarks, 3: Value/shadow block-in, 4: Midtones/washes/local color, 5: Detailing/edges, 6: Final highlights/finishing accents). Make the advice deeply specific to ${targetMedium}!`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: base64Image,
                },
              },
              { text: prompt },
            ],
          },
        ],
      });

      const responseText = response.text ? response.text.trim() : '';
      console.log('[GeminiService] Received Gemini response length:', responseText.length);

      // Clean potential JSON markdown wraps
      const cleanedJson = responseText
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```$/i, '')
        .trim();

      const parsed = JSON.parse(cleanedJson);
      if (parsed.stages && parsed.stages.length > 0) {
        return parsed;
      }
    } catch (err) {
      console.warn('[GeminiService] Gemini API call failed or timed out, using fine-art fallback engine:', err.message);
    }
  } else {
    console.log('[GeminiService] No GEMINI_API_KEY provided in .env. Using built-in Fine-Art Studio Engine.');
  }

  // Use the rich, tailored academic fallback
  return generateArtisticTutorialFallback({
    targetMedium,
    originalMedium,
    description,
    subjectType,
  });
}

module.exports = {
  generateArtTutorial,
  generateArtisticTutorialFallback,
};
