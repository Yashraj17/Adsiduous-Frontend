import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Navbar } from './components/common/Navbar';
import { SearchFilters } from './components/media/SearchFilters';
import { MediaGrid } from './components/media/MediaGrid';
import { AuthModal } from './components/auth/AuthModal';
import { UploadModal } from './components/media/UploadModal';
import { MediaPreviewModal } from './components/media/MediaPreviewModal';
import { LiveToast } from './components/realTime/LiveToast';
import { fetchCurrentUser, setUnauthenticated } from './store/authSlice';
import { Sparkles, Layers, ShieldCheck, Zap } from 'lucide-react';

export default function App() {
  const dispatch = useDispatch();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchCurrentUser());

    const handleAuthLogout = () => {
      dispatch(setUnauthenticated());
    };
    window.addEventListener('auth:logout', handleAuthLogout);
    return () => window.removeEventListener('auth:logout', handleAuthLogout);
  }, [dispatch]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <Navbar
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
      />

      {/* Main Container */}
      <main style={{ flex: 1, maxWidth: '1400px', width: '100%', margin: '0 auto', padding: '2rem 1.5rem' }}>
        
        {/* Hero Section */}
        <section style={{ textAlign: 'center', margin: '1rem 0 2.5rem 0' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            color: '#a5b4fc',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '1rem',
          }}>
            <Sparkles size={16} />
            POWERED BY CLOUDINARY & MONGO RELEVANCE RANKING
          </div>

          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: '1rem',
            background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 50%, #94a3b8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Discover, Search & Preview <br />
            <span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Multimedia Assets in Real-Time
            </span>
          </h2>

          <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto 2rem auto', fontSize: '1.05rem' }}>
            Upload images, high-definition videos, audio tracks, and PDF documents with secure JWT authentication and instant keyword relevance scoring.
          </p>

          {/* Feature Badges */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={18} color="var(--accent-primary)" />
              JWT Auth & Cookie Storage
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Zap size={18} color="var(--accent-secondary)" />
              Live WebSocket Broadcasts
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Layers size={18} color="#10b981" />
              Dynamic Relevance Score
            </div>
          </div>
        </section>

        {/* Search & Filter Bar */}
        <SearchFilters />

        {/* Media Grid Feed */}
        <MediaGrid onOpenUploadModal={() => setIsUploadModalOpen(true)} />

      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-glass)',
        padding: '1.5rem',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.88rem',
        background: 'rgba(11, 15, 25, 0.9)',
      }}>
        <p>© 2026 Adsiduous  — Built with React, Express & Cloudinary</p>
      </footer>

      {/* Modals & Realtime Toast */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <UploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} />
      <MediaPreviewModal />
      <LiveToast />
    </div>
  );
}
