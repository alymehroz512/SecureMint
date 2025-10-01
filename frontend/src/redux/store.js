import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import notificationReducer from './slices/notificationSlice';

// Configure the Redux store
const store = configureStore({
  reducer: {
    auth: authReducer,
    notification: notificationReducer,
  },
});

export default store;