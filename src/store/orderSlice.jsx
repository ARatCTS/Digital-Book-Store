// /src/store/orderSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../api/apiClient';

// Async Thunks for Orders
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/api/orders');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/api/users/${userId}/orders`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const placeOrder = createAsyncThunk(
  'orders/placeOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/api/orders', orderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/api/orders/${orderId}`);
      return orderId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// NEW ASYNC THUNK FOR UPDATING ORDER STATUS
export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      // Assuming a backend endpoint like PUT /api/orders/{orderId}/status
      // or PATCH /api/orders/{orderId} with a body { "status": "SHIPPED" }
      // This example uses a PUT to a dedicated status endpoint with a simple string status.
      // Adjust the URL and method based on your actual backend API.
      const response = await apiClient.put(`/api/orders/${orderId}/status`, { status });
      return response.data; // Assuming backend returns the updated order
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


const initialState = {
  items: [],
  status: 'idle',
  error: null,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    // No synchronous reducers needed for now
  },
  extraReducers: (builder) => {
    builder
      // fetchOrders
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // fetchUserOrders
      .addCase(fetchUserOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // placeOrder
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // cancelOrder
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = state.items.filter((order) => order.id !== action.payload);
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // NEW extraReducers for updateOrderStatus
      .addCase(updateOrderStatus.pending, (state) => {
        state.status = 'loading'; // Or a more specific status if you prefer
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedOrder = action.payload;
        const index = state.items.findIndex(order => order.id === updatedOrder.id);
        if (index !== -1) {
          state.items[index] = updatedOrder; // Update the order in the state
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;