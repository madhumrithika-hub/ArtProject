import React from 'react';
import { Palette, Sparkles, FolderHeart, LogOut, UserCheck } from 'lucide-react';
import { authApi } from '../services/api';

export default function Navbar({ activeTab, setActiveTab, user, onLogout }) {
  return (
    <header className="navbar-container glass-panel">
      <div className="navbar-left">
        <div className="brand-logo" onClick={() => setActiveTab('generator')}>
          <div className="brand-icon-wrapper">
            <Palette className="brand-icon" size={24} />
          </div>
          <div className="brand-text">
            <h1 className="brand-title">
              ArtFlow <span className="text-gold-gradient">Studio</span>
            </h1>
            <span className="brand-tagline">AI Step-by-Step Fine Art Tutor</span>
          </div>
        </div>
      </div>

      <nav className="navbar-center">
        <button
          className={`nav-tab-btn ${activeTab === 'generator' ? 'active' : ''}`}
          onClick={() => setActiveTab('generator')}
        >
          <Sparkles size={16} />
          <span>New Art Project</span>
        </button>

        <button
          className={`nav-tab-btn ${activeTab === 'gallery' ? 'active' : ''}`}
          onClick={() => setActiveTab('gallery')}
        >
          <FolderHeart size={16} />
          <span>My Saved Works</span>
        </button>
      </nav>

      <div className="navbar-right">
        {user && (
          <div className="user-profile-badge">
            <div className="user-avatar">
              <UserCheck size={16} />
            </div>
            <div className="user-info-text">
              <span className="user-handle">@{user.user_id}</span>
              <span className="user-email-preview">{user.email}</span>
            </div>
            <button
              className="logout-btn"
              title="Sign Out of Studio"
              onClick={() => {
                authApi.logout();
                onLogout();
              }}
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
