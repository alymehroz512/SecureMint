import axios from 'axios';
import store from '../redux/store';
import { refreshToken, logout } from '../redux/slices/authSlice';

// Create axios instance with fallback baseURL
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

console.log('apiClient baseURL:', apiClient.defaults.baseURL); // Debug log to verify baseURL

// Request interceptor to add access token
apiClient.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const accessToken = state.auth.accessToken;
   
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
   
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
   
    // If access token is expired and we haven't already tried to refresh
    if (
      error.response?.status === 403 &&
      error.response?.data?.code === 'TOKEN_INVALID' &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
     
      try {
        // Try to refresh the token
        await store.dispatch(refreshToken()).unwrap();
       
        // Retry the original request with new token
        const state = store.getState();
        const newAccessToken = state.auth.accessToken;
       
        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }
   
    return Promise.reject(error);
  }
);

export default apiClient;