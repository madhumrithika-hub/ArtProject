import React, { useRef, useState, useEffect } from 'react';
import {
  PenTool,
  Brush,
  Eraser,
  RotateCcw,
  RotateCw,
  Trash2,
  Grid,
  Eye,
  Save,
  Download,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { tutorialApi } from '../services/api';

export default function DrawingCanvas({
  tutorialId,
  referenceImageUrl,
  wireframeUrl,
  selectedColor,
  setSelectedColor,
  savedDrawing,
  onDrawingSaved,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeTool, setActiveTool] = useState('pencil'); // 'pencil' | 'brush' | 'pen' | 'eraser'
  const [brushSize, setBrushSize] = useState(4);
  const [brushOpacity, setBrushOpacity] = useState(0.85);

  // Onion skin overlay controls
  const [onionSkinOpacity, setOnionSkinOpacity] = useState(0); // 0 to 1
  const [onionSkinMode, setOnionSkinMode] = useState('wireframe'); // 'wireframe' | 'reference'

  // Proportional grid overlay
  const [gridMode, setGridMode] = useState('none'); // 'none' | 'thirds' | 'fine'

  // Undo/Redo history
  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);

  // Saving state
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Initialize canvas with proper dimensions
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = 800;
    const height = 900;

    canvas.width = width;
    canvas.height = height;

    // Fill with crisp off-white fine art paper tone
    ctx.fillStyle = '#faf8f5';
    ctx.fillRect(0, 0, width, height);

    // If user previously saved a drawing for this tutorial, restore it!
    if (savedDrawing?.canvasData) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        pushHistory();
      };
      img.src = savedDrawing.canvasData;
    } else {
      pushHistory();
    }
  }, [tutorialId]);

  const pushHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL();
    setHistory((prev) => {
      const nextHistory = prev.slice(0, historyStep + 1);
      return [...nextHistory, dataUrl];
    });
    setHistoryStep((prev) => prev + 1);
  };

  const undo = () => {
    if (historyStep <= 0) return;
    const nextStep = historyStep - 1;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      setHistoryStep(nextStep);
    };
    img.src = history[nextStep];
  };

  const redo = () => {
    if (historyStep >= history.length - 1) return;
    const nextStep = historyStep + 1;
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      setHistoryStep(nextStep);
    };
    img.src = history[nextStep];
  };

  const clearCanvas = () => {
    if (!window.confirm('Clear your drawing canvas?')) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#faf8f5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    pushHistory();
  };

  // Coordinates helper
  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    const coords = getCoordinates(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const coords = getCoordinates(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (activeTool === 'eraser') {
      ctx.strokeStyle = '#faf8f5';
      ctx.lineWidth = brushSize * 3;
      ctx.globalAlpha = 1.0;
    } else if (activeTool === 'pencil') {
      ctx.strokeStyle = selectedColor || '#23201e';
      ctx.lineWidth = Math.max(1, brushSize * 0.7);
      ctx.globalAlpha = Math.min(brushOpacity, 0.75);
    } else if (activeTool === 'brush') {
      ctx.strokeStyle = selectedColor || '#3b2f2f';
      ctx.lineWidth = brushSize * 2.5;
      ctx.globalAlpha = Math.min(brushOpacity * 0.45, 0.5); // Watercolor wash layering
    } else {
      // Pen
      ctx.strokeStyle = selectedColor || '#0a0a0a';
      ctx.lineWidth = brushSize;
      ctx.globalAlpha = brushOpacity;
    }

    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      pushHistory();
    }
  };

  // Save drawing progress to MongoDB
  const handleSaveDrawing = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !tutorialId) return;

    setSaving(true);
    setSaveSuccess(false);

    try {
      const dataUrl = canvas.toDataURL('image/png');
      await tutorialApi.saveDrawing(tutorialId, dataUrl, dataUrl);

      setSaveSuccess(true);
      if (onDrawingSaved) onDrawingSaved(dataUrl);

      // Trigger celebration confetti
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.8 },
      });

      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err) {
      alert('Failed to save drawing: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Download high-resolution PNG
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
      link.download = `drawvinci-practice-${tutorialId}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const overlaySource = onionSkinMode === 'wireframe' && wireframeUrl ? wireframeUrl : referenceImageUrl;

  return (
    <div className="drawing-canvas-wrapper glass-panel">
      {/* Studio Toolbar Header */}
      <div className="canvas-header-toolbar">
        <div className="tool-group">
          <button
            type="button"
            className={`canvas-tool-btn ${activeTool === 'pencil' ? 'active' : ''}`}
            title="Graphite Pencil (2H / HB / 2B)"
            onClick={() => setActiveTool('pencil')}
          >
            <PenTool size={16} />
            <span>Pencil</span>
          </button>

          <button
            type="button"
            className={`canvas-tool-btn ${activeTool === 'brush' ? 'active' : ''}`}
            title="Watercolor / Paint Brush (Soft wash)"
            onClick={() => setActiveTool('brush')}
          >
            <Brush size={16} />
            <span>Brush</span>
          </button>

          <button
            type="button"
            className={`canvas-tool-btn ${activeTool === 'pen' ? 'active' : ''}`}
            title="Ink Pen (Clean contours)"
            onClick={() => setActiveTool('pen')}
          >
            <PenTool size={16} />
            <span>Ink Pen</span>
          </button>

          <button
            type="button"
            className={`canvas-tool-btn ${activeTool === 'eraser' ? 'active' : ''}`}
            title="Kneaded Eraser"
            onClick={() => setActiveTool('eraser')}
          >
            <Eraser size={16} />
            <span>Eraser</span>
          </button>
        </div>

        {/* Color picker & presets */}
        <div className="color-control-group">
          <label className="color-swatch-wrapper" title="Custom color picker">
            <input
              type="color"
              value={selectedColor || '#23201e'}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="native-color-input"
            />
            <span
              className="color-swatch-preview"
              style={{ backgroundColor: selectedColor || '#23201e' }}
            ></span>
          </label>

          <div className="quick-palette-swatches">
            {['#1a1a1a', '#4a3728', '#8b5a2b', '#c49a6c', '#e8c4a2', '#a63d40', '#3b5998'].map((c) => (
              <button
                key={c}
                type="button"
                className={`quick-swatch-btn ${selectedColor === c ? 'selected' : ''}`}
                style={{ backgroundColor: c }}
                onClick={() => setSelectedColor(c)}
              />
            ))}
          </div>
        </div>

        {/* History & clear */}
        <div className="history-control-group">
          <button
            type="button"
            className="canvas-action-btn"
            onClick={undo}
            disabled={historyStep <= 0}
            title="Undo stroke"
          >
            <RotateCcw size={15} />
          </button>
          <button
            type="button"
            className="canvas-action-btn"
            onClick={redo}
            disabled={historyStep >= history.length - 1}
            title="Redo stroke"
          >
            <RotateCw size={15} />
          </button>
          <button
            type="button"
            className="canvas-action-btn danger-hover"
            onClick={clearCanvas}
            title="Clear canvas"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Secondary Controls Bar: Stroke Size, Opacity, Grid & Onion Skin */}
      <div className="canvas-sub-controls">
        <div className="slider-group">
          <span className="slider-label">Size: {brushSize}px</span>
          <input
            type="range"
            min="1"
            max="40"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="styled-range"
          />
        </div>

        <div className="slider-group">
          <span className="slider-label">Opacity: {Math.round(brushOpacity * 100)}%</span>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={brushOpacity}
            onChange={(e) => setBrushOpacity(Number(e.target.value))}
            className="styled-range"
          />
        </div>

        {/* Grid toggle */}
        <div className="toggle-group">
          <button
            type="button"
            className={`canvas-toggle-btn ${gridMode !== 'none' ? 'active' : ''}`}
            onClick={() => setGridMode((m) => (m === 'none' ? 'thirds' : m === 'thirds' ? 'fine' : 'none'))}
            title="Toggle alignment grid (Rule of Thirds / 6x6)"
          >
            <Grid size={15} />
            <span>Grid: {gridMode === 'none' ? 'Off' : gridMode === 'thirds' ? '3x3' : '6x6'}</span>
          </button>
        </div>

        {/* Onion skin slider */}
        <div className="slider-group onion-skin-slider-box">
          <Eye size={15} className="text-gold-gradient" />
          <span className="slider-label">
            Trace / Onion Skin: {Math.round(onionSkinOpacity * 100)}%
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={onionSkinOpacity}
            onChange={(e) => setOnionSkinOpacity(Number(e.target.value))}
            className="styled-range onion-range"
          />
          {onionSkinOpacity > 0 && (
            <button
              type="button"
              className="onion-mode-btn"
              onClick={() => setOnionSkinMode((m) => (m === 'wireframe' ? 'reference' : 'wireframe'))}
            >
              {onionSkinMode === 'wireframe' ? 'Wireframe' : 'Reference'}
            </button>
          )}
        </div>
      </div>

      {/* Main Drawing Pad Board with Overlays */}
      <div className="canvas-board-viewport" ref={containerRef}>
        <canvas
          ref={canvasRef}
          className="art-drawing-canvas"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />

        {/* Onion skin reference overlay image */}
        {onionSkinOpacity > 0 && overlaySource && (
          <img
            src={overlaySource}
            alt="Onion skin overlay"
            className="canvas-onion-overlay"
            style={{ opacity: onionSkinOpacity }}
          />
        )}

        {/* Proportional Grid Overlay */}
        {gridMode !== 'none' && (
          <div className={`canvas-grid-overlay grid-${gridMode}`}>
            <div className="grid-cell"></div>
            <div className="grid-cell"></div>
            <div className="grid-cell"></div>
            <div className="grid-cell"></div>
            <div className="grid-cell"></div>
            <div className="grid-cell"></div>
            <div className="grid-cell"></div>
            <div className="grid-cell"></div>
            <div className="grid-cell"></div>
          </div>
        )}
      </div>

      {/* Bottom Action Footer: Save to Profile & Download */}
      <div className="canvas-footer-actions">
        <div className="saved-status-note">
          {savedDrawing?.updatedAt && (
            <span>Last saved: {new Date(savedDrawing.updatedAt).toLocaleTimeString()}</span>
          )}
        </div>

        <div className="footer-btns-row">
          <button
            type="button"
            className="download-artwork-btn"
            onClick={handleDownload}
            title="Download PNG to your computer"
          >
            <Download size={16} />
            <span>Download PNG</span>
          </button>

          <button
            type="button"
            className={`save-artwork-btn ${saveSuccess ? 'success' : ''}`}
            onClick={handleSaveDrawing}
            disabled={saving}
          >
            {saving ? (
              <span>Saving Work...</span>
            ) : saveSuccess ? (
              <>
                <Check size={16} />
                <span>Saved to My Works!</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Save Work to Studio</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
