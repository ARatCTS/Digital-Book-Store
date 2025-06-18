// /src/store/orderSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../api/apiClient';
import { clearCart } from './cartSlice'; // Import to clear cart after order

/**
 * Async thunk for customers to place a new order.
 * This interacts with the POST /api/orders endpoint.
 */
export const placeOrder = createAsyncThunk(
    'orders/placeOrder',
    async (orderData, { dispatch, rejectWithValue }) => {
        try {
            const response = await apiClient.post('/api/orders', orderData);
            // On successful order, clear the user's shopping cart
            dispatch(clearCart());
            dispatch(fetchBooks()); // Refresh book list to update stock

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to place order');
        }
    }
);

/**
 * Async thunk for customers to fetch their own order history.
 * This interacts with the GET /api/orders/my-orders endpoint.
 */
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


/**
 * Async thunk to fetch all orders for the admin panel.
 * This interacts with the GET /api/orders/admin endpoint.
 */
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

/**
 * Async thunk to update the status of a specific order.
 * This interacts with the PATCH /api/orders/{id}/status endpoint.
 */
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

// Defines the initial state for the orders slice.
const initialState = {
    items: [], // This will store all orders for the admin panel.
    userOrders: [], // This will store orders for the logged-in customer.
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
};

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {},
    // Handles actions defined by createAsyncThunk
    extraReducers: (builder) => {
        builder
            // Reducers for fetching all orders (Admin)
            .addCase(fetchAllOrders.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchAllOrders.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload; // Replace state with the fetched orders
            })
            .addCase(fetchAllOrders.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Reducer for updating a single order's status (Admin)
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                const index = state.items.findIndex(order => order.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(updateOrderStatus.rejected, (state, action) => {
                console.error("Failed to update order status:", action.payload);
            })
            // Reducers for customer-specific orders
            .addCase(fetchUserOrders.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUserOrders.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.userOrders = action.payload;
            })
            .addCase(placeOrder.fulfilled, (state, action) => {
                // Add the newly placed order to the user's order history
                state.userOrders.unshift(action.payload);
            });
    },
});

export default orderSlice.reducer;
