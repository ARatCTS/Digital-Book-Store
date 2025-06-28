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
        } catch (error) { /* Invalid token */ }
    }
    return { user: null, token: null, isAuthenticated: false, isAdmin: false, status: 'idle', error: null };
};

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
    try {
        const { data } = await apiClient.post('/api/auth/login', credentials);
        localStorage.setItem('jwtToken', data.token);
        return data.token;
    } catch (error) {
        // Ensure you're returning the specific error message from the backend
        // error.response?.data might be an object, if so, get the message property
        return rejectWithValue(error.response?.data?.message || error.response?.data || 'Login failed due to network error or invalid credentials.');
    }
});

export const updateUserProfile = createAsyncThunk('auth/updateProfile', async (userData, { dispatch, rejectWithValue }) => {
    try {
        // The backend uses the token to identify the user, so we send the DTO.
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
            state.status = 'idle'; // Reset status on logout
            state.error = null; // Clear any errors on logout
        },
        updateUser: (state, action) => {
            state.user = { ...state.user, ...action.payload };
        },
        clearAuthError: (state) => { // Add a reducer to clear error manually if needed
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
                state.error = null; // Clear any previous errors when a new login attempt starts
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                const token = action.payload;
                const decodedToken = jwtDecode(token);
                state.token = token;
                state.user = { id: decodedToken.userId, email: decodedToken.sub, roles: decodedToken.roles, name: decodedToken.name };
                state.isAuthenticated = true;
                state.isAdmin = decodedToken.roles.includes('ADMIN');
                state.status = 'succeeded';
                state.error = null; // Clear error on success
                console.log("State", state.user);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                // action.payload will contain the value passed to rejectWithValue
                state.error = action.payload;
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                state.isAdmin = false;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // User data is already updated by the `updateUser` reducer dispatched from the thunk
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