import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, UploadCloud, File, AlertCircle, CheckCircle } from 'lucide-react';
import { uploadMediaFile, clearUploadState } from '../../store/mediaSlice';

export const UploadModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { uploading, uploadSuccess, error } = useSelector((state) => state.media);

  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  if (!isOpen) return null;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (file) => {
    if (file) {
      setSelectedFile(file);
      if (!title) {
        // Auto populate title from file basename
        const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        setTitle(nameWithoutExt);
      }
    }
  };

  const handleAddTag = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const clean = tagInput.trim().replace(/^#/, '');
      if (!tags.includes(clean)) {
        setTags([...tags, clean]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile || !title) return;

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('tags', tags.join(','));

    const result = await dispatch(uploadMediaFile(formData));
    if (uploadMediaFile.fulfilled.match(result)) {
      setTimeout(() => {
        dispatch(clearUploadState());
        handleClose();
      }, 1200);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setTitle('');
    setDescription('');
    setTags([]);
    setTagInput('');
    dispatch(clearUploadState());
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '1rem',
    }}>
      <div className="glass-panel animate-fade-in" style={{
        width: '100%',
        maxWidth: '560px',
        padding: '2rem',
        borderRadius: 'var(--radius-lg)',
        position: 'relative',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>
        {/* Close Button */}
        <button
          id="close-upload-modal-btn"
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'rgba(255,255,255,0.05)',
            border: 'none',
            color: 'var(--text-secondary)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={18} />
        </button>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.4rem' }}>
          Upload Multimedia Asset
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
          Upload images, videos, audio tracks, or PDF documents up to 50MB.
        </p>

        {/* Status Alerts */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#f87171',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontSize: '0.88rem',
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {uploadSuccess && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            color: '#34d399',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontSize: '0.88rem',
          }}>
            <CheckCircle size={18} />
            <span>Media asset uploaded successfully! Indexing...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          
          {/* Drag & Drop Box */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            style={{
              border: `2px dashed ${dragActive ? 'var(--accent-primary)' : 'rgba(255,255,255,0.15)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '2rem 1.5rem',
              textAlign: 'center',
              background: dragActive ? 'rgba(99, 102, 241, 0.08)' : 'rgba(0,0,0,0.2)',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            <input
              id="file-upload-input"
              type="file"
              onChange={(e) => handleFileChange(e.target.files[0])}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: 0,
                cursor: 'pointer',
              }}
            />
            {selectedFile ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                <File size={28} color="var(--accent-primary)" />
                <div style={{ textAlign: 'left' }}>
                  <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>{selectedFile.name}</p>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>
              </div>
            ) : (
              <div>
                <UploadCloud size={40} color="var(--accent-primary)" style={{ marginBottom: '0.5rem' }} />
                <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  Drag and drop your file here, or <span style={{ color: 'var(--accent-primary)' }}>browse</span>
                </p>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>
                  Supports PNG, JPG, MP4, MP3, WAV, PDF up to 50MB
                </span>
              </div>
            )}
          </div>

          {/* Title Field */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 500 }}>
              Title *
            </label>
            <input
              id="upload-title-input"
              type="text"
              required
              placeholder="Descriptive asset title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
            />
          </div>

          {/* Description Field */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 500 }}>
              Description
            </label>
            <textarea
              id="upload-description-input"
              rows={3}
              placeholder="Brief description of the media file..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field"
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Tags Chips Field */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 500 }}>
              Tags (Press Enter or comma to add)
            </label>
            <div className="input-field" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', padding: '0.5rem', alignItems: 'center' }}>
              {tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    background: 'var(--accent-primary)',
                    color: '#fff',
                    fontSize: '0.78rem',
                    padding: '0.2rem 0.6rem',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}
                >
                  #{tag}
                  <X size={12} style={{ cursor: 'pointer' }} onClick={() => handleRemoveTag(tag)} />
                </span>
              ))}
              <input
                id="upload-tags-input"
                type="text"
                placeholder={tags.length === 0 ? "e.g. nature, video, tutorial" : ""}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#fff',
                  flex: 1,
                  minWidth: '120px',
                  fontSize: '0.9rem',
                }}
              />
            </div>
          </div>

          <button
            id="submit-upload-btn"
            type="submit"
            disabled={uploading || !selectedFile}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '0.8rem', marginTop: '0.5rem' }}
          >
            {uploading ? 'Uploading to Storage...' : 'Upload Asset'}
          </button>
        </form>

      </div>
    </div>
  );
};
