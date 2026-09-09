import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Eye, Trash2, Image as ImageIcon, Video as VideoIcon, Music as AudioIcon, FileText, User } from 'lucide-react';
import { setSelectedFile, deleteMediaFile, incrementView } from '../../store/mediaSlice';

export const MediaCard = ({ media }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const isOwner = user && media.uploader && (user.id === media.uploader._id || user.id === media.uploader);

  const handleCardClick = () => {
    dispatch(incrementView(media._id));
    dispatch(setSelectedFile(media));
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${media.title}"?`)) {
      dispatch(deleteMediaFile(media._id));
    }
  };

  const getMediaIcon = () => {
    switch (media.resourceType) {
      case 'image': return <ImageIcon size={20} color="#a855f7" />;
      case 'video': return <VideoIcon size={20} color="#ec4899" />;
      case 'audio': return <AudioIcon size={20} color="#3b82f6" />;
      default: return <FileText size={20} color="#10b981" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div
      className="glass-panel"
      onClick={handleCardClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative',
        height: '100%',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
      }}
    >
      {/* Thumbnail Area */}
      <div style={{
        height: '190px',
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.4)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {media.resourceType === 'image' ? (
          <img
            src={media.fileUrl}
            alt={media.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            loading="lazy"
          />
        ) : media.resourceType === 'video' ? (
          <video
            src={media.fileUrl}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            muted
          />
        ) : (media.resourceType === 'pdf' || media.format === 'pdf' || media.fileUrl?.toLowerCase().endsWith('.pdf')) && media.fileUrl.includes('cloudinary.com') ? (
          <img
            src={media.fileUrl.replace(/\.pdf$/i, '.jpg')}
            alt={media.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            loading="lazy"
          />
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--text-secondary)'
          }}>
            {getMediaIcon()}
            <span style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>
              {media.format || media.resourceType}
            </span>
          </div>
        )}

        {/* Top Badges */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          right: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{
            background: 'rgba(11, 15, 25, 0.75)',
            backdropFilter: 'blur(6px)',
            color: '#fff',
            fontSize: '0.72rem',
            fontWeight: 600,
            padding: '0.25rem 0.6rem',
            borderRadius: 'var(--radius-full)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
          }}>
            {getMediaIcon()}
            {media.resourceType.toUpperCase()}
          </span>

          {media.relevanceScore !== undefined && (
            <span style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: '#fff',
              fontSize: '0.7rem',
              fontWeight: 700,
              padding: '0.2rem 0.5rem',
              borderRadius: 'var(--radius-full)',
            }}>
              Score: {media.relevanceScore}
            </span>
          )}
        </div>
      </div>

      {/* Content Metadata */}
      <div style={{ padding: '1.1rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{
            fontSize: '1.05rem',
            fontWeight: 700,
            marginBottom: '0.4rem',
            color: 'var(--text-main)',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {media.title}
          </h3>

          {media.description && (
            <p style={{
              fontSize: '0.83rem',
              color: 'var(--text-secondary)',
              marginBottom: '0.75rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {media.description}
            </p>
          )}

          {/* Tags Chips */}
          {media.tags && media.tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.85rem' }}>
              {media.tags.map((tag, idx) => (
                <span
                  key={idx}
                  style={{
                    background: 'rgba(99, 102, 241, 0.15)',
                    color: '#a5b4fc',
                    fontSize: '0.72rem',
                    fontWeight: 500,
                    padding: '0.15rem 0.5rem',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer Meta Details */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid var(--border-glass)',
          paddingTop: '0.75rem',
          marginTop: '0.5rem',
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <User size={14} color="var(--accent-primary)" />
            <span>{media.uploader?.username || 'Anonymous'}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Eye size={14} />
              {media.viewsCount || 0}
            </span>
            <span>{formatFileSize(media.size)}</span>
            {isOwner && (
              <button
                onClick={handleDelete}
                title="Delete Media"
                style={{ background: 'none', color: '#f87171', display: 'flex', alignItems: 'center' }}
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
