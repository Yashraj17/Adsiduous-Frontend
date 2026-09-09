import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Download, Eye, Calendar, HardDrive, User, Tag } from 'lucide-react';
import { setSelectedFile } from '../../store/mediaSlice';

export const MediaPreviewModal = () => {
  const dispatch = useDispatch();
  const { selectedFile } = useSelector((state) => state.media);

  if (!selectedFile) return null;

  const handleClose = () => {
    dispatch(setSelectedFile(null));
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const renderViewer = () => {
    switch (selectedFile.resourceType) {
      case 'image':
        return (
          <img
            src={selectedFile.fileUrl}
            alt={selectedFile.title}
            style={{
              maxWidth: '100%',
              maxHeight: '65vh',
              objectFit: 'contain',
              borderRadius: 'var(--radius-md)',
              margin: '0 auto',
              display: 'block',
            }}
          />
        );
      case 'video':
        return (
          <video
            controls
            autoPlay
            src={selectedFile.fileUrl}
            style={{
              width: '100%',
              maxHeight: '65vh',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#000',
            }}
          />
        );
      case 'audio':
        return (
          <div style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(236, 72, 153, 0.15))',
            borderRadius: 'var(--radius-md)',
            padding: '3rem 2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem',
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-glow)',
            }}>
              🎵
            </div>
            <audio controls src={selectedFile.fileUrl} style={{ width: '100%', maxWidth: '500px' }} />
          </div>
        );
      case 'raw':
      case 'pdf':
      default:
        const isPdf = selectedFile.resourceType === 'pdf' || selectedFile.format === 'pdf' || selectedFile.fileUrl?.toLowerCase().endsWith('.pdf');
        const googleDocsUrl = `https://docs.google.com/gview?url=${encodeURIComponent(selectedFile.fileUrl)}&embedded=true`;
        const pdfImageUrl = selectedFile.fileUrl.includes('cloudinary.com') ? selectedFile.fileUrl.replace(/\.pdf$/i, '.jpg') : null;

        return (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{
              width: '100%',
              height: '62vh',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              background: '#1e293b',
              position: 'relative',
            }}>
              {isPdf ? (
                <iframe
                  src={googleDocsUrl}
                  title={selectedFile.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    backgroundColor: '#ffffff',
                  }}
                  onError={(e) => console.log('Iframe load error', e)}
                />
              ) : (
                <iframe
                  src={selectedFile.fileUrl}
                  title={selectedFile.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    backgroundColor: '#ffffff',
                  }}
                />
              )}
            </div>

            {/* Quick Open in New Tab option */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <a
                href={selectedFile.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
                style={{ fontSize: '0.85rem', padding: '0.45rem 1rem' }}
              >
                📄 Open PDF in New Browser Tab
              </a>
              {pdfImageUrl && (
                <a
                  href={pdfImageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary"
                  style={{ fontSize: '0.85rem', padding: '0.45rem 1rem' }}
                >
                  🖼️ View First Page Image
                </a>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '1.5rem',
    }}>
      <div className="glass-panel animate-fade-in" style={{
        width: '100%',
        maxWidth: '900px',
        maxHeight: '90vh',
        padding: '2rem',
        borderRadius: 'var(--radius-lg)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        overflowY: 'auto',
      }}>
        {/* Close Button */}
        <button
          id="close-preview-modal-btn"
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'rgba(255,255,255,0.08)',
            border: 'none',
            color: 'var(--text-main)',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
          }}
        >
          <X size={20} />
        </button>

        {/* Media Player / Viewer */}
        <div style={{ width: '100%', textAlign: 'center' }}>
          {renderViewer()}
        </div>

        {/* Details & Actions Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.3rem' }}>
              {selectedFile.title}
            </h2>
            {selectedFile.description && (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '0.75rem' }}>
                {selectedFile.description}
              </p>
            )}
          </div>

          <a
            href={selectedFile.fileUrl}
            target="_blank"
            rel="noreferrer"
            download
            className="btn-primary"
            style={{ padding: '0.6rem 1.2rem', fontSize: '0.88rem' }}
          >
            <Download size={16} />
            Download Original
          </a>
        </div>

        {/* Tags */}
        {selectedFile.tags && selectedFile.tags.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Tag size={16} color="var(--accent-primary)" />
            {selectedFile.tags.map((tag, idx) => (
              <span
                key={idx}
                style={{
                  background: 'rgba(99, 102, 241, 0.18)',
                  color: '#a5b4fc',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  padding: '0.2rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Metadata Footer */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '1rem',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-glass)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          fontSize: '0.85rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
            <User size={16} color="var(--accent-secondary)" />
            <div>
              <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)' }}>Uploader</span>
              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                {selectedFile.uploader?.username || 'Anonymous'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
            <Eye size={16} color="var(--accent-primary)" />
            <div>
              <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)' }}>Total Views</span>
              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                {selectedFile.viewsCount || 1}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
            <Calendar size={16} color="#10b981" />
            <div>
              <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)' }}>Uploaded Date</span>
              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                {formatDate(selectedFile.createdAt)}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
            <HardDrive size={16} color="#f59e0b" />
            <div>
              <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)' }}>File Format</span>
              <span style={{ fontWeight: 600, color: 'var(--text-main)', textTransform: 'uppercase' }}>
                {selectedFile.format || selectedFile.resourceType}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
