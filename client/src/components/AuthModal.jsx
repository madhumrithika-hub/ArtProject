import React, { useState } from 'react';
import { Palette, User, Mail, Lock, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { authApi } from '../services/api';

export default function AuthModal({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(true);
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        if (!userId.trim() || !email.trim() || !password.trim()) {
          throw new Error('Please fill in user_id, mail id, and password.');
        }
        const res = await authApi.register(userId, email, password);
        onLoginSuccess(res.user);
      } else {
        if (!identifier.trim() || !password.trim()) {
          throw new Error('Please enter your user_id / mail id and password.');
        }
        const res = await authApi.login(identifier, password);
        onLoginSuccess(res.user);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-card glass-panel animate-fade-in">
        <div className="auth-header">
          <div className="auth-logo-badge">
            <Palette className="icon-palette" size={32} />
          </div>
          <h2 className="auth-title">
            ArtFlow <span className="text-gold-gradient">Studio</span>
          </h2>
          <p className="auth-subtitle">
            {isRegister
              ? 'Register your artist credentials to begin and securely save all your art journeys'
              : 'Sign in to access your atelier, tutorials, and saved artwork'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab-btn ${isRegister ? 'active' : ''}`}
            onClick={() => { setIsRegister(true); setError(''); }}
          >
            Register Account
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${!isRegister ? 'active' : ''}`}
            onClick={() => { setIsRegister(false); setError(''); }}
          >
            Artist Sign In
          </button>
        </div>

        {error && (
          <div className="auth-error-alert animate-fade-in">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {isRegister ? (
            <>
              <div className="form-group">
                <label>
                  <User size={15} /> User ID (Artist Handle)
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    placeholder="e.g. monet_art or da_vinci"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
                <span className="input-hint">Your unique artist handle for saving and identifying works</span>
              </div>

              <div className="form-group">
                <label>
                  <Mail size={15} /> Mail ID (Email Address)
                </label>
                <div className="input-wrapper">
                  <input
                    type="email"
                    placeholder="artist@atelier.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>
                  <Lock size={15} /> Secret Password
                </label>
                <div className="input-wrapper">
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label>
                  <User size={15} /> User ID or Mail ID
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    placeholder="Enter your user_id or email"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div className="form-group">
                <label>
                  <Lock size={15} /> Password
                </label>
                <div className="input-wrapper">
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </>
          )}

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? (
              <span className="spinner-text">Authenticating Studio Access...</span>
            ) : isRegister ? (
              <>
                <span>Enter ArtFlow Studio</span>
                <ArrowRight size={18} />
              </>
            ) : (
              <>
                <span>Sign In to Studio</span>
                <Sparkles size={18} />
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <ShieldCheck size={14} className="shield-icon" />
          <span>Encrypted with JWT & bcrypt. Your drawings and saved projects are stored securely.</span>
        </div>
      </div>
    </div>
  );
}
