import React from 'react';
import { useSelector } from 'react-redux';
import { MediaCard } from './MediaCard';
import { SearchX, Loader2 } from 'lucide-react';

export const MediaGrid = ({ onOpenUploadModal }) => {
  const { files, loading, error } = useSelector((state) => state.media);
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (loading && files.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '1rem' }}>
        <Loader2 size={36} className="pulse-glow" color="var(--accent-primary)" style={{ animation: 'spin 1s linear infinite' }} />
        <p style={{ color: 'var(--text-secondary)' }}>Searching & ranking media repository...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
        <p style={{ color: '#f87171', fontSize: '1.1rem', fontWeight: 600 }}>{error}</p>
      </div>
    );
  }

  if (!files || files.length === 0) {
    return (
      <div className="glass-panel animate-fade-in" style={{ padding: '4rem 2rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
        <div style={{
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem auto'
        }}>
          <SearchX size={36} color="var(--text-muted)" />
        </div>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          No Media Files Found
        </h3>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 1.5rem auto', fontSize: '0.92rem' }}>
          We couldn't find any multimedia matching your search criteria or tags. Try searching with different keywords or upload a new file.
        </p>
        {isAuthenticated && (
          <button className="btn-primary" onClick={onOpenUploadModal} style={{ margin: '0 auto' }}>
            Upload First File
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
      gap: '1.5rem',
      paddingBottom: '3rem'
    }}>
      {files.map((file) => (
        <MediaCard key={file._id} media={file} />
      ))}
    </div>
  );
};
