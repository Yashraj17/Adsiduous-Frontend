import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Sparkles, X } from 'lucide-react';
import { initSocketClient } from '../../services/socket';
import { addLiveNotification, clearLiveNotification, fetchMediaFiles } from '../../store/mediaSlice';

export const LiveToast = () => {
  const dispatch = useDispatch();
  const { liveNotification, searchQuery, resourceType, sortBy } = useSelector((state) => state.media);

  useEffect(() => {
    const socket = initSocketClient();
    if (socket) {
      socket.on('media:uploaded', (data) => {
        dispatch(addLiveNotification(data));
        // Refresh grid
        dispatch(fetchMediaFiles({ query: searchQuery, resourceType, sortBy, page: 1 }));
      });
    }
    return () => {
      if (socket) socket.off('media:uploaded');
    };
  }, [dispatch, searchQuery, resourceType, sortBy]);

  if (!liveNotification) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 120,
      maxWidth: '380px',
      width: '100%',
    }}>
      <div className="glass-panel animate-fade-in" style={{
        padding: '1rem 1.25rem',
        borderRadius: 'var(--radius-md)',
        background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95), rgba(30, 27, 75, 0.95))',
        border: '1px solid var(--border-glow)',
        boxShadow: 'var(--shadow-glow)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.8rem',
        position: 'relative',
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: 'var(--accent-gradient)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Sparkles size={18} color="#fff" />
        </div>

        <div style={{ flex: 1 }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginBottom: '0.2rem' }}>
            New File Uploaded Live!
          </h4>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            <span style={{ fontWeight: 600, color: 'var(--accent-secondary)' }}>
              {liveNotification.uploader}
            </span>{' '}
            just uploaded "{liveNotification.title}"
          </p>
        </div>

        <button
          onClick={() => dispatch(clearLiveNotification())}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
