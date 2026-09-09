import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Upload, LogIn, LogOut, User as UserIcon, Sparkles, FileText } from 'lucide-react';
import { logoutUser } from '../../store/authSlice';

export const Navbar = ({ onOpenAuthModal, onOpenUploadModal }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  return (
    <header className="glass-panel" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, padding: '1rem 2rem', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <Sparkles size={24} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, background: 'linear-gradient(to right, #ffffff, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              ADSIDUOUS
            </h1>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 500, letterSpacing: '0.05em' }}>
              MULTIMEDIA HUB & SEARCH
            </span>
          </div>
        </div>

        {/* Action Controls & Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <a
            href="http://localhost:5000/api-docs"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary"
            id="swagger-docs-btn"
            style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }}
          >
            <FileText size={16} />
            Swagger API Docs
          </a>

          {isAuthenticated ? (
            <>
              <button
                id="open-upload-modal-btn"
                className="btn-primary"
                onClick={onOpenUploadModal}
                style={{ padding: '0.55rem 1.2rem', fontSize: '0.9rem' }}
              >
                <Upload size={18} />
                Upload Media
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(255,255,255,0.05)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-glass)' }}>
                <UserIcon size={18} color="var(--accent-secondary)" />
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  {user?.username}
                </span>
                <button
                  id="logout-btn"
                  onClick={() => dispatch(logoutUser())}
                  title="Logout"
                  style={{ background: 'transparent', color: 'var(--text-secondary)', marginLeft: '0.4rem', display: 'flex', alignItems: 'center' }}
                >
                  <LogOut size={16} />
                </button>
              </div>
            </>
          ) : (
            <button
              id="open-auth-modal-btn"
              className="btn-primary"
              onClick={onOpenAuthModal}
              style={{ padding: '0.55rem 1.3rem', fontSize: '0.9rem' }}
            >
              <LogIn size={18} />
              Sign In / Register
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
