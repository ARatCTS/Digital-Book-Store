import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from './../api/apiClient';
import { jwtDecode } from 'jwt-decode'; // Use a library like jwt-decode

const getInitialState = () => {
  const token = localStorage.getItem('jwtToken');
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp > currentTime) {
        return {
          token,
          user: { email: decodedToken.sub, roles: decodedToken.roles },
          isAuthenticated: true,
          isAdmin: decodedToken.roles.includes('ROLE_ADMIN'),
          status: 'succeeded',
          error: null,
        };
      }
    } catch (error) {
        // Invalid token
    }
  }
  return { user: null, token: null, isAuthenticated: false, isAdmin: false, status: 'idle', error: null };
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.post('/api/auth/login', credentials);
      localStorage.setItem('jwtToken', data.token);
      return data.token;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    logout: (state) => {
      localStorage.removeItem('jwtToken');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isAdmin = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const token = action.payload;
        const decodedToken = jwtDecode(token);
        state.token = token;
        state.user = { email: decodedToken.sub, roles: decodedToken.roles };
        state.isAuthenticated = true;
        state.isAdmin = decodedToken.roles.includes('ROLE_ADMIN');
        state.status = 'succeeded';
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
