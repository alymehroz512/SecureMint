import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, userData, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Registration failed');
  }
});

export const login = createAsyncThunk('auth/login', async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, userData, {
      headers: { 'Content-Type': 'application/json' },
    });
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Login failed';
    if (message === 'Email not found') {
      return rejectWithValue({ message: 'Email not found' });
    } else if (message === 'Password incorrect') {
      return rejectWithValue({ message: 'Password incorrect' });
    }
    return rejectWithValue({ message });
  }
});

export const sendOtp = createAsyncThunk('auth/sendOtp', async (email, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/send-otp`, { email }, {
      headers: { 'Content-Type': 'application/json' },
    });
    const { otp, username } = response.data; // Assume backend returns username
    await sendOtp(email, otp, username || 'User'); // Fallback to 'User' if username is missing

    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to send OTP');
  }
});

export const verifyOtp = createAsyncThunk('auth/verifyOtp', async ({ email, otp }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/verify-otp`, { email, otp }, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'OTP verification failed');
  }
});

export const resetPassword = createAsyncThunk('auth/resetPassword', async ({ email, otp, newPassword }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/reset-password`, { email, otp, newPassword }, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Password reset failed');
  }
});

export const fetchUser = createAsyncThunk('auth/fetchUser', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/me`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch user');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token') || null,
    status: 'idle',
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      state.status = 'idle';
      localStorage.removeItem('token');
      console.log('Logout action dispatched');
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
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.user = null;
        state.token = null;
        localStorage.removeItem('token');
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

export const { logout } = authSlice.actions;
export default authSlice.reducer;