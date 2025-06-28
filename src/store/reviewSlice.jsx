// /src/store/reviewSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../api/apiClient';

// Async Thunks for Reviews
export const fetchReviewsByBookId = createAsyncThunk(
  'reviews/fetchReviewsByBookId',
  async (bookId, { rejectWithValue }) => {
    try {
      // Backend: .requestMatchers("/api/reviews/book/**").permitAll()
      const response = await apiClient.get(`/api/reviews/book/${bookId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// NEW ASYNC THUNK: Fetch all reviews (typically for Admin moderation)
export const fetchAllReviews = createAsyncThunk(
  'reviews/fetchAllReviews',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/api/reviews/admin'); // <-- updated endpoint
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);



export const addReview = createAsyncThunk(
  'reviews/addReview',
  async (reviewData, { rejectWithValue }) => {
    try {
      // Backend: .requestMatchers("/api/reviews/**").authenticated()
      const response = await apiClient.post('/api/reviews', reviewData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateReview = createAsyncThunk(
  'reviews/updateReview',
  async ({ id, reviewData }, { rejectWithValue }) => {
    try {
      // Backend: .requestMatchers("/api/reviews/**").authenticated()
      const response = await apiClient.put(`/api/reviews/${id}`, reviewData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteReview = createAsyncThunk(
  'reviews/deleteReview',
  async (reviewId, { rejectWithValue }) => {
    try {
      // Backend: .requestMatchers("/api/reviews/**").authenticated()
      await apiClient.delete(`/api/reviews/${reviewId}`);
      return reviewId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Admin-specific review moderation
export const moderateReview = createAsyncThunk(
  'reviews/moderateReview',
  async ({ id, approved }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/api/reviews/moderate/${id}?approved=${approved}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);



const initialState = {
  items: [],
  status: 'idle',
  error: null,
};

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    // No synchronous reducers needed for now
  },
  extraReducers: (builder) => {
    builder
      // fetchReviewsByBookId
      .addCase(fetchReviewsByBookId.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchReviewsByBookId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload; // Assuming payload is an array of reviews for a book
      })
      .addCase(fetchReviewsByBookId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // NEW extraReducers for fetchAllReviews
      .addCase(fetchAllReviews.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllReviews.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload; // Assuming payload is an array of ALL reviews
      })
      .addCase(fetchAllReviews.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // addReview
      .addCase(addReview.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
      })
      .addCase(addReview.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // updateReview
      .addCase(updateReview.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.items.findIndex((review) => review.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // deleteReview
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = state.items.filter((review) => review.id !== action.payload);
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // moderateReview
      .addCase(moderateReview.pending, (state) => {
        // Can add a specific status for moderation if needed
      })
      .addCase(moderateReview.fulfilled, (state, action) => {
        const index = state.items.findIndex((review) => review.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(moderateReview.rejected, (state, action) => {
        // Handle moderation failure
      });
  },
});

export default reviewSlice.reducer;