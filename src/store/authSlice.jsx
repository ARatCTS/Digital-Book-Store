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
        return rejectWithValue(error.response?.data);
    }
});

export const updateUserProfile = createAsyncThunk('auth/updateProfile', async (userData, { dispatch, rejectWithValue }) => {
    try {
        // The backend uses the token to identify the user, so we send the DTO.
        const response = await apiClient.put(`/api/users/profile`, userData);
        dispatch(updateUser(response.data));
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data);
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: getInitialState(),
    reducers: {
        logout: (state) => {
            localStorage.removeItem('jwtToken');
            state.user = null; state.token = null; state.isAuthenticated = false; state.isAdmin = false;
        },
        updateUser: (state, action) => {
            state.user = { ...state.user, ...action.payload };
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loginUser.fulfilled, (state, action) => {
            const token = action.payload;
            const decodedToken = jwtDecode(token);
            state.token = token;
            state.user = { id: decodedToken.userId, email: decodedToken.sub, roles: decodedToken.roles, name: decodedToken.name };
            state.isAuthenticated = true;
            state.isAdmin = decodedToken.roles.includes('ADMIN');
            state.status = 'succeeded';
            console.log("State",state.user );
        });
    },
});

export const { logout, updateUser } = authSlice.actions;
export default authSlice.reducer;