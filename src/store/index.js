import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import mediaReducer from './mediaSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    media: mediaReducer,
  },
});
