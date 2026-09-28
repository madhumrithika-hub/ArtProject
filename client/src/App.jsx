import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import ArtGenerator from './components/ArtGenerator';
import TutorialStudio from './components/TutorialStudio';
import SavedGallery from './components/SavedGallery';
import { getStoredUser, authApi } from './services/api';
import './App.css';

export default function App() {
  const [user, setUser] = useState(getStoredUser());
  const [activeTab, setActiveTab] = useState('generator'); // 'generator' | 'studio' | 'gallery'
  const [activeTutorial, setActiveTutorial] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Verify auth session on load
  useEffect(() => {
    const verifySession = async () => {
      try {
        const stored = getStoredUser();
        if (stored) {
          const res = await authApi.getMe();
          setUser(res.user);
        }
      } catch (err) {
        console.warn('Session expired or invalid, requiring login.');
        authApi.logout();
        setUser(null);
      } finally {
        setAuthChecked(true);
      }
    };
    verifySession();
  }, []);

  const handleLoginSuccess = (authenticatedUser) => {
    setUser(authenticatedUser);
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTutorial(null);
    setActiveTab('generator');
  };

  const handleTutorialCreated = (tutorial) => {
    setActiveTutorial(tutorial);
    setActiveTab('studio');
  };

  const handleOpenTutorialFromGallery = (tutorial) => {
    setActiveTutorial(tutorial);
    setActiveTab('studio');
  };

  if (!authChecked) {
    return (
      <div className="app-splash-screen">
        <div className="progress-spinner-ring"></div>
        <span>Entering ArtFlow Atelier...</span>
      </div>
    );
  }

  // Requirement: User must register credentials before using the application
  if (!user) {
    return <AuthModal onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-container">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
      />

      <main className="main-content-viewport">
        {activeTab === 'generator' && (
          <ArtGenerator onTutorialCreated={handleTutorialCreated} />
        )}

        {activeTab === 'studio' && activeTutorial && (
          <TutorialStudio
            tutorial={activeTutorial}
            onBackToGenerator={() => setActiveTab('generator')}
          />
        )}

        {activeTab === 'gallery' && (
          <SavedGallery
            onOpenTutorial={handleOpenTutorialFromGallery}
            onNewProject={() => setActiveTab('generator')}
          />
        )}
      </main>
    </div>
  );
}
