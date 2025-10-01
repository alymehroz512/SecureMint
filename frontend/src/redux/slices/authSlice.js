import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../utils/axiosInterceptor'; // Adjust path if needed

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    console.log('Register request sent'); // Debug log
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error); // Debug log
    return rejectWithValue(error.response?.data?.message || 'Registration failed');
  }
});

export const login = createAsyncThunk('auth/login', async (userData, { rejectWithValue }) => {
  try {
    console.log('Login request sent'); // Debug log
    const response = await apiClient.post('/auth/login', userData);
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    return response.data;
  } catch (error) {
    console.error('Login error:', error); // Debug log
    const message = error.response?.data?.message || 'Login failed';
    if (message === 'Email not found') {
      return rejectWithValue({ message: 'Email not found' });
    } else if (message === 'Password incorrect') {
      return rejectWithValue({ message: 'Password incorrect' });
    }
    return rejectWithValue({ message });
  }
});

export const refreshToken = createAsyncThunk('auth/refreshToken', async (_, { rejectWithValue }) => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token found');
    }
    
    console.log('Refresh token request sent'); // Debug log
    const response = await apiClient.post('/auth/refresh-token', { refreshToken });
    
    localStorage.setItem('accessToken', response.data.accessToken);
    return response.data;
  } catch (error) {
    console.error('Refresh token error:', error); // Debug log
    // If refresh fails, clear tokens
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    return rejectWithValue(error.response?.data?.message || 'Token refresh failed');
  }
});

export const sendOtp = createAsyncThunk('auth/sendOtp', async (email, { rejectWithValue }) => {
  try {
    console.log('Send OTP request sent'); // Debug log
    const response = await apiClient.post('/auth/send-otp', { email });
    return response.data;
  } catch (error) {
    console.error('Send OTP error:', error); // Debug log
    return rejectWithValue(error.response?.data?.message || 'Failed to send OTP');
  }
});

export const verifyOtp = createAsyncThunk('auth/verifyOtp', async ({ email, otp }, { rejectWithValue }) => {
  try {
    console.log('Verify OTP request sent'); // Debug log
    const response = await apiClient.post('/auth/verify-otp', { email, otp });
    return response.data;
  } catch (error) {
    console.error('Verify OTP error:', error); // Debug log
    return rejectWithValue(error.response?.data?.message || 'OTP verification failed');
  }
});

export const resetPassword = createAsyncThunk('auth/resetPassword', async ({ email, otp, newPassword }, { rejectWithValue }) => {
  try {
    console.log('Reset password request sent'); // Debug log
    const response = await apiClient.post('/auth/reset-password', { email, otp, newPassword });
    return response.data;
  } catch (error) {
    console.error('Reset password error:', error); // Debug log
    return rejectWithValue(error.response?.data?.message || 'Password reset failed');
  }
});

export const fetchUser = createAsyncThunk('auth/fetchUser', async (_, { rejectWithValue }) => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      throw new Error('No access token found');
    }
    console.log('Fetch user request sent'); // Debug log
    const response = await apiClient.get('/user/me');
    return response.data;
  } catch (error) {
    console.error('Fetch user error:', error); // Debug log
    // If access token is expired, try to refresh
    if (error.response?.status === 403 && error.response?.data?.code === 'TOKEN_INVALID') {
      throw new Error('TOKEN_EXPIRED');
    }
    return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch user');
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (refreshToken) {
      console.log('Logout request sent'); // Debug log
      await apiClient.post('/auth/logout', { refreshToken });
    }
    
    return {};
  } catch (error) {
    console.error('Logout error:', error); // Debug log
    // Even if logout fails on server, we still clear local tokens
    return rejectWithValue(error.response?.data?.message || 'Logout failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    status: 'idle',
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.error = null;
      state.status = 'idle';
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      console.log('Logout action dispatched');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.error = null;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        // Don't clear user data immediately on fetch failure
        // Let the app handle token refresh
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.error = null;
        state.status = 'idle';
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      })
      .addCase(sendOtp.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.message;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;