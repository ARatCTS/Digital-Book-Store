import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../api/apiClient';
import { clearCart } from './cartSlice'; 


export const placeOrder = createAsyncThunk(
    'orders/placeOrder',
    async (orderData, { dispatch, rejectWithValue }) => {
        try {
            const response = await apiClient.post('/api/orders', orderData);
            dispatch(clearCart());
            dispatch(fetchBooks()); 

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to place order');
        }
    }
);

export const fetchUserOrders = createAsyncThunk(
    'orders/fetchUserOrders',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(`/api/orders/my-orders?userId=${userId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch user orders');
        }
    }
);



export const fetchAllOrders = createAsyncThunk(
    'orders/fetchAllOrders',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiClient.get('/api/orders/admin');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch orders');
        }
    }
);


export const updateOrderStatus = createAsyncThunk(
    'orders/updateOrderStatus',
    async ({ orderId, newStatus }, { rejectWithValue }) => {
        try {
            const response = await apiClient.patch(`/api/orders/${orderId}/status?newStatus=${newStatus}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to update status');
        }
    }
);

const initialState = {
    items: [], 
    userOrders: [], 
    status: 'idle', 
    error: null,
};

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllOrders.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchAllOrders.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload; 
            })
            .addCase(fetchAllOrders.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                const index = state.items.findIndex(order => order.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(updateOrderStatus.rejected, (state, action) => {
                console.error("Failed to update order status:", action.payload);
            })
            .addCase(fetchUserOrders.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUserOrders.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.userOrders = action.payload;
            })
            .addCase(placeOrder.fulfilled, (state, action) => {
                state.userOrders.unshift(action.payload);
            });
    },
});

export default orderSlice.reducer;
