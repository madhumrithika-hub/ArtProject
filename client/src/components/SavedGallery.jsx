import React, { useState, useEffect } from 'react';
import {
  FolderHeart,
  Brush,
  Layers,
  ArrowRight,
  Trash2,
  Calendar,
  Sparkles,
  ExternalLink,
  PlusCircle,
} from 'lucide-react';
import { tutorialApi } from '../services/api';

export default function SavedGallery({ onOpenTutorial, onNewProject }) {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTutorials = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await tutorialApi.getAll();
      setTutorials(data.tutorials || []);
    } catch (err) {
      setError(err.message || 'Failed to load your gallery.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTutorials();
  }, []);

  const handleDelete = async (id, title, e) => {
    e.stopPropagation();
    if (!window.confirm(`Delete "${title}" from your studio library?`)) return;

    try {
      await tutorialApi.delete(id);
      setTutorials((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    }
  };

  return (
    <div className="gallery-page-container">
      <div className="gallery-header-bar">
        <div>
          <h2 className="gallery-main-title">
            My Studio <span className="text-gold-gradient">Gallery & Works</span>
          </h2>
          <p className="gallery-subtext">
            All your generated step-by-step masterclasses and saved canvas practice drawings stored in your account.
          </p>
        </div>

        <button type="button" className="new-project-pill-btn" onClick={onNewProject}>
          <PlusCircle size={18} />
          <span>New Art Project</span>
        </button>
      </div>

      {loading ? (
        <div className="gallery-loading-state">
          <div className="progress-spinner-ring"></div>
          <span>Loading your atelier library...</span>
        </div>
      ) : error ? (
        <div className="gallery-error-banner">
          <span>{error}</span>
          <button type="button" onClick={fetchTutorials} className="retry-btn">
            Retry
          </button>
        </div>
      ) : tutorials.length === 0 ? (
        <div className="gallery-empty-state glass-panel">
          <div className="empty-icon-circle">
            <FolderHeart size={44} className="text-gold-gradient" />
          </div>
          <h3>Your Studio Gallery is Empty</h3>
          <p>
            You haven't generated any art tutorials or saved any sketches yet. Upload your first visual to start
            mastering drawing and painting!
          </p>
          <button type="button" className="empty-start-btn" onClick={onNewProject}>
            <Sparkles size={18} />
            <span>Create Your First Tutorial</span>
          </button>
        </div>
      ) : (
        <div className="gallery-grid">
          {tutorials.map((item) => (
            <div
              key={item._id}
              className="gallery-artwork-card glass-panel animate-fade-in"
              onClick={() => onOpenTutorial(item)}
            >
              {/* Card visual showcase */}
              <div className="card-media-duo">
                <div className="media-preview-box">
                  <img src={item.originalImageUrl} alt={item.title} className="media-img" />
                  <span className="media-tag">Reference</span>
                </div>

                {item.savedDrawing?.previewUrl ? (
                  <div className="media-preview-box user-drawing-box">
                    <img
                      src={item.savedDrawing.previewUrl}
                      alt="User Practice Drawing"
                      className="media-img"
                    />
                    <span className="media-tag drawing-tag">My Drawing</span>
                  </div>
                ) : (
                  <div className="media-preview-box placeholder-drawing-box">
                    <Brush size={24} className="placeholder-brush" />
                    <span>In-Progress</span>
                  </div>
                )}
              </div>

              {/* Card content info */}
              <div className="card-info-body">
                <div className="card-badges-row">
                  <span className="badge-target">
                    <Brush size={12} /> {item.targetMedium}
                  </span>
                  <span className="badge-stages">{item.stages?.length || 0} Stages</span>
                </div>

                <h4 className="card-artwork-title">{item.title}</h4>
                <p className="card-artwork-desc">{item.description}</p>

                <div className="card-footer-row">
                  <div className="card-date">
                    <Calendar size={13} />
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="card-actions-group">
                    <button
                      type="button"
                      className="card-delete-btn"
                      title="Delete from studio"
                      onClick={(e) => handleDelete(item._id, item.title, e)}
                    >
                      <Trash2 size={15} />
                    </button>

                    <button
                      type="button"
                      className="card-open-btn"
                      title="Open Tutorial & Practice"
                    >
                      <span>Open Studio</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
