import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../api/apiClient';
import { jwtDecode } from 'jwt-decode';

const getInitialState = () => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            if (decodedToken.exp * 1000 > Date.now()) {
                return {
                    token,
                    user: { id: decodedToken.userId, email: decodedToken.sub, roles: decodedToken.roles, name: decodedToken.name },
                    isAuthenticated: true,
                    isAdmin: decodedToken.roles.includes('ADMIN'),
                    status: 'succeeded', error: null,
                };
            }
        } catch (error) {  }
    }
    return { user: null, token: null, isAuthenticated: false, isAdmin: false, status: 'idle', error: null };
};

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
    try {
        const { data } = await apiClient.post('/api/auth/login', credentials);
        localStorage.setItem('jwtToken', data.token);
        return data.token;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.response?.data || 'Login failed due to network error or invalid credentials.');
    }
});

export const updateUserProfile = createAsyncThunk('auth/updateProfile', async (userData, { dispatch, rejectWithValue }) => {
    try {
        const response = await apiClient.put(`/api/users/profile`, userData);
        dispatch(updateUser(response.data));
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.response?.data || 'Failed to update profile.');
    }
});

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
            state.status = 'idle'; 
            state.error = null; 
        },
        updateUser: (state, action) => {
            state.user = { ...state.user, ...action.payload };
        },
        clearAuthError: (state) => { 
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
                state.error = null; 
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                const token = action.payload;
                const decodedToken = jwtDecode(token);
                state.token = token;
                state.user = { id: decodedToken.userId, email: decodedToken.sub, roles: decodedToken.roles, name: decodedToken.name };
                state.isAuthenticated = true;
                state.isAdmin = decodedToken.roles.includes('ADMIN');
                state.status = 'succeeded';
                state.error = null; 
                console.log("State", state.user);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                state.isAdmin = false;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export const { logout, updateUser, clearAuthError } = authSlice.actions;
export default authSlice.reducer;