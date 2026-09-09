import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

// Async Thunks
export const fetchMediaFiles = createAsyncThunk(
  'media/fetchMediaFiles',
  async ({ query = '', resourceType = 'all', sortBy = 'relevance', page = 1 }, { rejectWithValue }) => {
    try {
      const response = await api.get('/files/search', {
        params: { query, resourceType, sortBy, page, limit: 12 },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch media files');
    }
  }
);

export const uploadMediaFile = createAsyncThunk(
  'media/uploadMediaFile',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'File upload failed');
    }
  }
);

export const incrementView = createAsyncThunk(
  'media/incrementView',
  async (mediaId, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/files/${mediaId}/view`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update view count');
    }
  }
);

export const deleteMediaFile = createAsyncThunk(
  'media/deleteMediaFile',
  async (mediaId, { rejectWithValue }) => {
    try {
      await api.delete(`/files/${mediaId}`);
      return mediaId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete file');
    }
  }
);

const mediaSlice = createSlice({
  name: 'media',
  initialState: {
    files: [],
    pagination: { page: 1, totalPages: 1, totalCount: 0 },
    searchQuery: '',
    resourceType: 'all',
    sortBy: 'relevance',
    selectedFile: null,
    loading: false,
    uploading: false,
    uploadSuccess: false,
    error: null,
    liveNotification: null,
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setResourceType: (state, action) => {
      state.resourceType = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setSelectedFile: (state, action) => {
      state.selectedFile = action.payload;
    },
    clearUploadState: (state) => {
      state.uploading = false;
      state.uploadSuccess = false;
      state.error = null;
    },
    addLiveNotification: (state, action) => {
      state.liveNotification = action.payload;
    },
    clearLiveNotification: (state) => {
      state.liveNotification = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Files
      .addCase(fetchMediaFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMediaFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.files = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchMediaFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Upload File
      .addCase(uploadMediaFile.pending, (state) => {
        state.uploading = true;
        state.uploadSuccess = false;
        state.error = null;
      })
      .addCase(uploadMediaFile.fulfilled, (state, action) => {
        state.uploading = false;
        state.uploadSuccess = true;
        state.files.unshift(action.payload.media);
      })
      .addCase(uploadMediaFile.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload;
      })
      // Increment Views
      .addCase(incrementView.fulfilled, (state, action) => {
        const index = state.files.findIndex((f) => f._id === action.payload.media._id);
        if (index !== -1) {
          state.files[index].viewsCount = action.payload.viewsCount;
        }
        if (state.selectedFile && state.selectedFile._id === action.payload.media._id) {
          state.selectedFile.viewsCount = action.payload.viewsCount;
        }
      })
      // Delete File
      .addCase(deleteMediaFile.fulfilled, (state, action) => {
        state.files = state.files.filter((f) => f._id !== action.payload);
        if (state.selectedFile && state.selectedFile._id === action.payload) {
          state.selectedFile = null;
        }
      });
  },
});

export const {
  setSearchQuery,
  setResourceType,
  setSortBy,
  setSelectedFile,
  clearUploadState,
  addLiveNotification,
  clearLiveNotification,
} = mediaSlice.actions;

export default mediaSlice.reducer;
