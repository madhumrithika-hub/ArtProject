import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  Palette,
  Lightbulb,
  AlertTriangle,
  Clock,
  Wrench,
  CheckCircle,
  Maximize2,
  Brush,
  ArrowLeft,
} from 'lucide-react';
import DrawingCanvas from './DrawingCanvas';

export default function TutorialStudio({ tutorial, onBackToGenerator }) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [viewMode, setViewMode] = useState('stage'); // 'stage' | 'reference' | 'wireframe' | 'valuestudy'
  const [selectedColor, setSelectedColor] = useState('#23201e');
  const [showSupplies, setShowSupplies] = useState(false);

  const stages = tutorial?.stages || [];
  const currentStage = stages[currentStepIdx] || stages[0];

  const nextStep = () => {
    if (currentStepIdx < stages.length - 1) {
      setCurrentStepIdx((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx((prev) => prev - 1);
    }
  };

  // Determine which image to show in the left visual viewer
  let currentVisualSrc = tutorial.originalImageUrl;
  if (viewMode === 'stage' && currentStage?.layerVisualUrl) {
    currentVisualSrc = currentStage.layerVisualUrl;
  } else if (viewMode === 'wireframe' && tutorial.wireframeUrl) {
    currentVisualSrc = tutorial.wireframeUrl;
  } else if (viewMode === 'valuestudy' && tutorial.valueStudyUrl) {
    currentVisualSrc = tutorial.valueStudyUrl;
  } else {
    currentVisualSrc = tutorial.originalImageUrl;
  }

  return (
    <div className="tutorial-studio-page">
      {/* Studio Header Bar */}
      <div className="studio-topbar glass-panel">
        <div className="studio-topbar-left">
          <button
            type="button"
            className="back-nav-btn"
            onClick={onBackToGenerator}
            title="Create another tutorial"
          >
            <ArrowLeft size={16} />
            <span>New Project</span>
          </button>

          <div className="studio-title-block">
            <h2 className="studio-main-title">{tutorial.title}</h2>
            <div className="studio-meta-badges">
              <span className="meta-badge target-badge">
                <Brush size={12} /> Target: {tutorial.targetMedium}
              </span>
              <span className="meta-badge original-badge">
                <Layers size={12} /> From: {tutorial.originalMedium}
              </span>
              <span className="meta-badge subject-badge">{tutorial.subjectType}</span>
            </div>
          </div>
        </div>

        <div className="studio-topbar-right">
          <button
            type="button"
            className={`supplies-toggle-btn ${showSupplies ? 'active' : ''}`}
            onClick={() => setShowSupplies((v) => !v)}
          >
            <Wrench size={15} />
            <span>Recommended Supplies ({tutorial.suppliesNeeded?.length || 0})</span>
          </button>
        </div>
      </div>

      {/* Supplies Drawer / Banner */}
      {showSupplies && tutorial.suppliesNeeded?.length > 0 && (
        <div className="supplies-drawer glass-panel animate-fade-in">
          <h4 className="supplies-title">
            <Sparkles size={16} className="text-gold-gradient" /> Recommended Tools for {tutorial.targetMedium}
          </h4>
          <div className="supplies-grid">
            {tutorial.suppliesNeeded.map((supply, idx) => (
              <div key={idx} className="supply-card">
                <div className="supply-type-badge">{supply.type}</div>
                <div className="supply-name">{supply.name}</div>
                <div className="supply-note">{supply.note}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Conversion Strategy Banner */}
      {tutorial.description && (
        <div className="strategy-banner glass-panel">
          <Lightbulb size={18} className="strategy-icon" />
          <div className="strategy-text">
            <strong>Medium Translation Blueprint:</strong> {tutorial.description}
          </div>
        </div>
      )}

      {/* Step Navigation Pill Strip */}
      <div className="step-stepper-strip glass-panel">
        <div className="stepper-progress-text">
          <span>Stage {currentStepIdx + 1} of {stages.length}</span>
          <span className="progress-percent">
            {Math.round(((currentStepIdx + 1) / stages.length) * 100)}% Complete
          </span>
        </div>

        <div className="step-pills-row">
          {stages.map((stage, idx) => (
            <button
              key={idx}
              type="button"
              className={`step-pill-btn ${idx === currentStepIdx ? 'active' : idx < currentStepIdx ? 'completed' : ''}`}
              onClick={() => setCurrentStepIdx(idx)}
            >
              <span className="step-pill-num">{idx + 1}</span>
              <span className="step-pill-label">{stage.title.split(':')[1] || stage.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Dual Workspace: Guidance Player (Left) + Drawing Canvas (Right) */}
      <div className="studio-dual-workspace">
        {/* Left Column: Guidance & Visual Stage Deconstruction */}
        <div className="studio-guidance-pane glass-panel">
          {/* Visual Display with Mode Toggles */}
          <div className="visual-stage-viewer">
            <div className="viewer-tab-bar">
              <button
                type="button"
                className={`viewer-tab ${viewMode === 'stage' ? 'active' : ''}`}
                onClick={() => setViewMode('stage')}
              >
                Stage Focus
              </button>
              <button
                type="button"
                className={`viewer-tab ${viewMode === 'reference' ? 'active' : ''}`}
                onClick={() => setViewMode('reference')}
              >
                Original Ref
              </button>
              {tutorial.wireframeUrl && (
                <button
                  type="button"
                  className={`viewer-tab ${viewMode === 'wireframe' ? 'active' : ''}`}
                  onClick={() => setViewMode('wireframe')}
                >
                  Wireframe
                </button>
              )}
              {tutorial.valueStudyUrl && (
                <button
                  type="button"
                  className={`viewer-tab ${viewMode === 'valuestudy' ? 'active' : ''}`}
                  onClick={() => setViewMode('valuestudy')}
                >
                  3-Tone Values
                </button>
              )}
            </div>

            <div className="visual-image-frame">
              <img
                src={currentVisualSrc}
                alt="Stage visual representation"
                className="stage-rendered-image"
              />
              <div className="visual-caption-badge">
                {viewMode === 'stage'
                  ? `Stage ${currentStepIdx + 1}: ${currentStage?.title}`
                  : viewMode === 'reference'
                  ? 'Original Reference Visual'
                  : viewMode === 'wireframe'
                  ? 'Structural Wireframe Contours'
                  : '3-Tone Shadow/Midtone Block-In'}
              </div>
            </div>
          </div>

          {/* Color Palette Swatches */}
          {tutorial.colorPalette?.length > 0 && (
            <div className="palette-section">
              <div className="palette-header">
                <Palette size={14} className="text-gold-gradient" />
                <span>Extracted Pigment Palette (Click swatch to set drawing brush)</span>
              </div>
              <div className="palette-swatches-grid">
                {tutorial.colorPalette.map((pigment, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`pigment-swatch-card ${selectedColor === pigment.hex ? 'active-color' : ''}`}
                    onClick={() => setSelectedColor(pigment.hex)}
                    title={`Use ${pigment.name} (${pigment.hex})`}
                  >
                    <div
                      className="swatch-color-box"
                      style={{ backgroundColor: pigment.hex }}
                    ></div>
                    <div className="swatch-details">
                      <span className="pigment-name">{pigment.name}</span>
                      <span className="pigment-role">{pigment.role}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Current Stage Instruction Card */}
          {currentStage && (
            <div className="stage-instruction-card animate-fade-in" key={currentStepIdx}>
              <div className="stage-meta-row">
                <span className="stage-step-tag">Step {currentStepIdx + 1} of {stages.length}</span>
                {currentStage.recommendedTool && (
                  <span className="stage-tool-tag">
                    <Brush size={12} /> {currentStage.recommendedTool}
                  </span>
                )}
                {currentStage.estimatedTime && (
                  <span className="stage-time-tag">
                    <Clock size={12} /> {currentStage.estimatedTime}
                  </span>
                )}
              </div>

              <h3 className="stage-main-title">{currentStage.title}</h3>
              {currentStage.subtitle && (
                <p className="stage-subtitle">{currentStage.subtitle}</p>
              )}

              {/* Actionable instructions checklist */}
              <div className="instruction-bullets-list">
                {currentStage.instructions?.map((inst, i) => (
                  <div key={i} className="instruction-item">
                    <div className="instruction-bullet-num">{i + 1}</div>
                    <div className="instruction-text">{inst}</div>
                  </div>
                ))}
              </div>

              {/* Pro Artist Tip */}
              {currentStage.artistTip && (
                <div className="tip-box">
                  <Lightbulb size={18} className="tip-icon" />
                  <div>
                    <strong>Master Artist Tip:</strong> {currentStage.artistTip}
                  </div>
                </div>
              )}

              {/* Common Pitfalls / Mistakes */}
              {currentStage.commonMistakes && (
                <div className="mistake-box">
                  <AlertTriangle size={18} className="mistake-icon" />
                  <div>
                    <strong>Watch Out:</strong> {currentStage.commonMistakes}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="stage-nav-controls">
            <button
              type="button"
              className="stage-nav-btn prev-btn"
              onClick={prevStep}
              disabled={currentStepIdx === 0}
            >
              <ChevronLeft size={18} />
              <span>Previous Stage</span>
            </button>

            <span className="step-counter-text">
              {currentStepIdx + 1} / {stages.length}
            </span>

            <button
              type="button"
              className="stage-nav-btn next-btn"
              onClick={nextStep}
              disabled={currentStepIdx === stages.length - 1}
            >
              <span>Next Stage</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Right Column: Interactive Practice Drawing Studio */}
        <div className="studio-canvas-pane">
          <DrawingCanvas
            tutorialId={tutorial._id}
            referenceImageUrl={tutorial.originalImageUrl}
            wireframeUrl={tutorial.wireframeUrl}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            savedDrawing={tutorial.savedDrawing}
          />
        </div>
      </div>
    </div>
  );
}
