import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, SlidersHorizontal, Image, Video, Music, FileText, Grid } from 'lucide-react';
import { setSearchQuery, setResourceType, setSortBy, fetchMediaFiles } from '../../store/mediaSlice';

export const SearchFilters = () => {
  const dispatch = useDispatch();
  const { searchQuery, resourceType, sortBy } = useSelector((state) => state.media);
  const [localQuery, setLocalQuery] = useState(searchQuery);

  // Debounce search query updates
  useEffect(() => {
    const handler = setTimeout(() => {
      dispatch(setSearchQuery(localQuery));
    }, 350);
    return () => clearTimeout(handler);
  }, [localQuery, dispatch]);

  // Fetch updated results whenever query, type, or sort changes
  useEffect(() => {
    dispatch(fetchMediaFiles({ query: searchQuery, resourceType, sortBy, page: 1 }));
  }, [searchQuery, resourceType, sortBy, dispatch]);

  const typeTabs = [
    { id: 'all', label: 'All Media', icon: Grid },
    { id: 'image', label: 'Images', icon: Image },
    { id: 'video', label: 'Videos', icon: Video },
    { id: 'audio', label: 'Audio', icon: Music },
    { id: 'pdf', label: 'PDFs & Docs', icon: FileText },
  ];

  return (
    <div style={{ marginBottom: '2rem' }}>
      {/* Search Input Bar */}
      <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
        <Search
          size={22}
          style={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--accent-primary)',
          }}
        />
        <input
          id="search-input-field"
          type="text"
          placeholder="Search by keywords, tags (e.g. nature, tutorial), file title..."
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          className="input-field"
          style={{
            paddingLeft: '3.2rem',
            paddingRight: '1rem',
            height: '56px',
            fontSize: '1.05rem',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-card)',
          }}
        />
      </div>

      {/* Filter Bar & Sort Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        
        {/* Type Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {typeTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = resourceType === tab.id;
            return (
              <button
                key={tab.id}
                id={`filter-tab-${tab.id}`}
                onClick={() => dispatch(setResourceType(tab.id))}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.55rem 1.1rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.88rem',
                  fontWeight: isActive ? 600 : 500,
                  background: isActive ? 'var(--accent-gradient)' : 'rgba(255, 255, 255, 0.05)',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  border: isActive ? 'none' : '1px solid var(--border-glass)',
                  transition: 'all 0.2s ease',
                }}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Sort Select Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <SlidersHorizontal size={18} color="var(--text-secondary)" />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Sort by:</span>
          <select
            id="sort-by-select"
            value={sortBy}
            onChange={(e) => dispatch(setSortBy(e.target.value))}
            style={{
              background: 'rgba(17, 24, 39, 0.9)',
              color: 'var(--text-main)',
              border: '1px solid var(--border-glass)',
              borderRadius: 'var(--radius-md)',
              padding: '0.45rem 0.8rem',
              fontSize: '0.88rem',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="relevance">🔥 Relevance Score</option>
            <option value="views">👁️ Most Viewed</option>
            <option value="newest">⚡ Newest First</option>
            <option value="oldest">📅 Oldest First</option>
          </select>
        </div>

      </div>
    </div>
  );
};
