import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileImage,
  Video,
  Sparkles,
  ArrowRight,
  Palette,
  Brush,
  Layers,
  Wand2,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { tutorialApi } from '../services/api';

const PRESET_EXAMPLES = [
  {
    title: 'Renaissance Girl (Oil to Watercolor)',
    originalMedium: 'Oil Painting',
    targetMedium: 'Watercolor Painting',
    subjectType: 'Face & Portrait',
    description: 'The reference is an oil painting portrait, but I want to paint it in watercolor with soft wet-on-wet atmospheric washes and preserve glowing paper highlights.',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=700&auto=format&fit=crop&q=80',
  },
  {
    title: 'Dramatic Portrait (Photo to Pencil Sketch)',
    originalMedium: 'Real-Life Photo',
    targetMedium: 'Pencil / Graphite Sketch',
    subjectType: 'Face & Portrait',
    description: 'Reference is a high-contrast photograph of a face; teach me how to deconstruct it using the Loomis method, 2H gesture lines, and deep 6B graphite shading.',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=700&auto=format&fit=crop&q=80',
  },
  {
    title: 'Alpine Mist (Photo to Oil Painting)',
    originalMedium: 'Real-Life Photo',
    targetMedium: 'Oil Painting',
    subjectType: 'Landscape & Scenery',
    description: 'A mountain scenery with dramatic clouds. I want to paint it in oil painting using an imprimatura wash, fat-over-lean blocking, and impasto mountain ridge highlights.',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=700&auto=format&fit=crop&q=80',
  },
  {
    title: 'Sunlit Still Life (Gouache to Watercolor)',
    originalMedium: 'Gouache Painting',
    targetMedium: 'Watercolor Painting',
    subjectType: 'Still Life & Objects',
    description: 'This is an opaque gouache still life of ceramics and fruit, but I want to execute it in transparent watercolor with wet-on-dry glazing and crisp shadows.',
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=700&auto=format&fit=crop&q=80',
  },
];

const LOADING_MESSAGES = [
  'Inspecting visual planes, anatomy and light source...',
  'Extracting academic 3-tone value study (Shadows, Mids, Highlights)...',
  'Synthesizing structural wireframe & Loomis guide lines...',
  'Formulating custom medium-translation technique...',
  'Compiling pigment palette and pencil grade recommendations...',
  'Assembling your step-by-step masterclass tutorial...',
];

export default function ArtGenerator({ onTutorialCreated }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isVideo, setIsVideo] = useState(false);
  const [originalMedium, setOriginalMedium] = useState('Oil Painting');
  const [targetMedium, setTargetMedium] = useState('Watercolor Painting');
  const [subjectType, setSubjectType] = useState('Face & Portrait');
  const [description, setDescription] = useState(
    'The reference is an oil painting, but I want to paint it in watercolor with soft wet-on-wet washes and preserve pure paper highlights.'
  );

  const [loading, setLoading] = useState(false);
  const [loadingStepIdx, setLoadingStepIdx] = useState(0);
  const [error, setError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef(null);

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    setIsVideo(selectedFile.type.startsWith('video/'));

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    setError('');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const applyPreset = async (preset) => {
    setError('');
    setOriginalMedium(preset.originalMedium);
    setTargetMedium(preset.targetMedium);
    setSubjectType(preset.subjectType);
    setDescription(preset.description);
    setPreviewUrl(preset.imageUrl);
    setIsVideo(false);

    try {
      // Fetch sample image as file
      const response = await fetch(preset.imageUrl);
      const blob = await response.blob();
      const sampleFile = new File([blob], 'sample-reference.jpg', { type: 'image/jpeg' });
      setFile(sampleFile);
    } catch (e) {
      console.warn('Could not fetch preset blob directly:', e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please upload an image or video file of the artwork reference.');
      return;
    }

    setLoading(true);
    setError('');
    setLoadingStepIdx(0);

    // Rotate loading messages
    const interval = setInterval(() => {
      setLoadingStepIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2400);

    try {
      const formData = new FormData();
      formData.append('visual', file);
      formData.append('originalMedium', originalMedium);
      formData.append('targetMedium', targetMedium);
      formData.append('subjectType', subjectType);
      formData.append('description', description);

      const result = await tutorialApi.generate(formData);
      clearInterval(interval);
      onTutorialCreated(result.tutorial);
    } catch (err) {
      clearInterval(interval);
      setError(err.message || 'Failed to generate tutorial. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="generator-container">
      {/* Hero Banner */}
      <section className="generator-hero">
        <div className="hero-badge">
          <Wand2 size={14} className="wand-icon" />
          <span>Interactive Fine Art Tutor & Medium Transformer</span>
        </div>
        <h2 className="hero-heading">
          Transform <span className="text-gold-gradient">Any Visual</span> into a Step-by-Step Masterclass
        </h2>
        <p className="hero-subtext">
          Upload an oil painting, watercolor, gouache, pencil sketch, doodle, or scenario. Tell us what medium you want to
          create it in, and our AI art engine will generate tailored, academic guidance from blank canvas to finished portrait.
        </p>
      </section>

      {/* Main Workflow Form */}
      <form onSubmit={handleSubmit} className="generator-grid">
        {/* Left Column: Visual Ingestion */}
        <div className="generator-card glass-panel visual-upload-card">
          <h3 className="section-title">
            <FileImage size={20} className="text-gold-gradient" />
            <span>1. Upload Art Visual (Image / Video)</span>
          </h3>

          <div
            className={`dropzone-container ${isDragOver ? 'drag-active' : ''} ${previewUrl ? 'has-preview' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => !previewUrl && fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
              accept="image/*,video/*"
              style={{ display: 'none' }}
            />

            {previewUrl ? (
              <div className="preview-wrapper">
                {isVideo ? (
                  <video src={previewUrl} controls className="preview-media" />
                ) : (
                  <img src={previewUrl} alt="Art Reference Preview" className="preview-media" />
                )}
                <div className="preview-overlay-bar">
                  <span className="file-info-badge">
                    {isVideo ? <Video size={14} /> : <FileImage size={14} />}
                    {file?.name || 'Art Reference Loaded'}
                  </span>
                  <button
                    type="button"
                    className="change-file-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                  >
                    <RefreshCw size={14} />
                    <span>Change File</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="dropzone-empty-state">
                <div className="upload-icon-circle">
                  <UploadCloud size={36} />
                </div>
                <h4>Drag & Drop your artwork or video clip here</h4>
                <p>Supports Oil, Watercolor, Gouache, Doodles, Sketches, Portraits, & Sceneries (JPG, PNG, MP4)</p>
                <button
                  type="button"
                  className="browse-files-btn"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Browse Files from Device
                </button>
              </div>
            )}
          </div>

          {/* Quick preset selector */}
          <div className="preset-strip">
            <span className="preset-label">Or try a curated art reference:</span>
            <div className="preset-buttons-row">
              {PRESET_EXAMPLES.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  className="preset-chip-btn"
                  onClick={() => applyPreset(preset)}
                >
                  <Sparkles size={12} />
                  <span>{preset.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Custom Intent & Medium Conversion */}
        <div className="generator-card glass-panel intent-card">
          <h3 className="section-title">
            <Palette size={20} className="text-gold-gradient" />
            <span>2. Define Medium & Artistic Goals</span>
          </h3>

          <div className="medium-selectors-row">
            <div className="form-field">
              <label>
                <Layers size={14} /> Reference Style / Medium
              </label>
              <select
                value={originalMedium}
                onChange={(e) => setOriginalMedium(e.target.value)}
              >
                <option value="Oil Painting">Oil Painting</option>
                <option value="Watercolor Painting">Watercolor Painting</option>
                <option value="Gouache Painting">Gouache Painting</option>
                <option value="Pencil / Graphite Sketch">Pencil / Graphite Sketch</option>
                <option value="Charcoal Drawing">Charcoal Drawing</option>
                <option value="Doodle / Line Art">Doodle / Quick Line Art</option>
                <option value="Real-Life Photo">Real-Life Photo</option>
                <option value="Acrylic Painting">Acrylic Painting</option>
                <option value="Digital Artwork">Digital Artwork / Anime</option>
              </select>
            </div>

            <div className="form-field highlight-field">
              <label>
                <Brush size={14} /> Target Medium to Learn & Master
              </label>
              <select
                value={targetMedium}
                onChange={(e) => setTargetMedium(e.target.value)}
                className="select-target-medium"
              >
                <option value="Watercolor Painting">Watercolor Painting (Transparent Washes)</option>
                <option value="Gouache Painting">Gouache Painting (Opaque Matte Layers)</option>
                <option value="Oil Painting">Oil Painting (Fat over Lean & Glazes)</option>
                <option value="Pencil / Graphite Sketch">Pencil / Graphite Sketch (Loomis & Values)</option>
                <option value="Charcoal Drawing">Charcoal Drawing (Dramatic Lights & Darks)</option>
                <option value="Acrylic Painting">Acrylic Painting (Layered Expressive Strokes)</option>
                <option value="Pen & Ink / Crosshatch">Pen & Ink (Cross-hatching & Stippling)</option>
                <option value="Colored Pencil">Colored Pencil (Burnishing & Blend)</option>
              </select>
            </div>
          </div>

          <div className="form-field">
            <label>Subject / Genre</label>
            <div className="subject-tags-row">
              {['Face & Portrait', 'Figure & Anatomy', 'Landscape & Scenery', 'Still Life & Objects', 'Doodle & Concept Art'].map(
                (subj) => (
                  <button
                    type="button"
                    key={subj}
                    className={`subject-pill ${subjectType === subj ? 'active' : ''}`}
                    onClick={() => setSubjectType(subj)}
                  >
                    {subj}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="form-field">
            <label>
              Describe Your Vision & Technique Goals
              <span className="label-sub"> (e.g. mention if you want loose washes, realistic Loomis shading, or specific color palettes)</span>
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. The reference is an oil painting, but I want to paint it in watercolor with soft wet-on-wet washes and preserve pure paper highlights..."
              required
            />
          </div>

          {error && (
            <div className="generator-error-banner animate-fade-in">
              <span>{error}</span>
            </div>
          )}

          {/* Submission Button & Loading Animation */}
          <div className="submit-action-area">
            {loading ? (
              <div className="generation-progress-box animate-fade-in">
                <div className="progress-spinner-ring"></div>
                <div className="progress-details">
                  <span className="progress-title">Deconstructing Artwork with Studio Engine...</span>
                  <span className="progress-stage-text">{LOADING_MESSAGES[loadingStepIdx]}</span>
                </div>
              </div>
            ) : (
              <button type="submit" className="generate-masterclass-btn">
                <div className="btn-shine"></div>
                <Sparkles size={20} />
                <span>Deconstruct & Generate Masterclass</span>
                <ArrowRight size={20} />
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
