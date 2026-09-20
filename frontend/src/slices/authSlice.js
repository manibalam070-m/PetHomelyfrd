import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api.js';

export const loadUser = createAsyncThunk('auth/load', async () => {
  const { data } = await api.get('/auth/me');
  return data.user;
});

export const login = createAsyncThunk('auth/login', async (creds) => {
  const { data } = await api.post('/auth/login', creds);
  return data.user;
});

export const register = createAsyncThunk('auth/register', async (userData) => {
  const { data } = await api.post('/auth/register', userData);
  return data.user;
});

export const logout = createAsyncThunk('auth/logout', async () => {
  await api.get('/auth/logout');
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, loading: false, error: null, isAuthenticated: false },
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUser.pending, (s) => { s.loading = true; })
      .addCase(loadUser.fulfilled, (s, a) => { s.loading = false; s.user = a.payload; s.isAuthenticated = true; })
      .addCase(loadUser.rejected, (s) => { s.loading = false; s.user = null; s.isAuthenticated = false; })
      .addCase(login.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(login.fulfilled, (s, a) => { s.loading = false; s.user = a.payload; s.isAuthenticated = true; })
      .addCase(login.rejected, (s, a) => { s.loading = false; s.error = a.error.message; })
      .addCase(register.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(register.fulfilled, (s, a) => { s.loading = false; s.user = a.payload; s.isAuthenticated = true; })
      .addCase(register.rejected, (s, a) => { s.loading = false; s.error = a.error.message; })
      .addCase(logout.fulfilled, (s) => { s.user = null; s.isAuthenticated = false; });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;