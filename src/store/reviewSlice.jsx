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
      // IMPORTANT: Return bookId along with reviews so we can store them by book ID
      return { bookId, reviews: response.data };
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
      // Note: For deletion, it's often useful if the backend returns the bookId
      // or if you pass it in the thunk arguments to easily update the normalized state.
      await apiClient.delete(`/api/reviews/${reviewId}`);
      return reviewId; // Return the ID of the deleted review
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
      return response.data; // This payload should contain the updated review (including its bookId)
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


const initialState = {
  // New normalized structure for reviews, keyed by bookId
  reviewsByBookId: {}, // { 'book-id-1': [{id: ..., rating: ...}, ...], 'book-id-2': [...] }
  // Store statuses and errors per bookId for granular loading feedback
  statuses: {}, // { 'book-id-1': 'loading', 'book-id-2': 'succeeded' }
  errors: {},    // { 'book-id-1': 'error-message', 'book-id-2': null }

  // Keep these for the fetchAllReviews (e.g., for admin panel)
  allReviews: [],
  allReviewsStatus: 'idle',
  allReviewsError: null,
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
      .addCase(fetchReviewsByBookId.pending, (state, action) => {
        const bookId = action.meta.arg; // Get bookId from the thunk's argument
        state.statuses[bookId] = 'loading';
        state.errors[bookId] = null; // Clear previous errors for this book
      })
      .addCase(fetchReviewsByBookId.fulfilled, (state, action) => {
        const { bookId, reviews } = action.payload; // Destructure bookId and reviews
        state.statuses[bookId] = 'succeeded';
        state.reviewsByBookId[bookId] = reviews; // Store reviews for this specific bookId
      })
      .addCase(fetchReviewsByBookId.rejected, (state, action) => {
        const bookId = action.meta.arg;
        state.statuses[bookId] = 'failed';
        state.errors[bookId] = action.payload; // Store error for this specific bookId
        state.reviewsByBookId[bookId] = []; // Clear reviews or keep previous on failure? Decide based on UX.
                                          // Setting to empty array ensures no stale data is shown.
      })

      // fetchAllReviews (for admin list, keeps separate state)
      .addCase(fetchAllReviews.pending, (state) => {
        state.allReviewsStatus = 'loading';
        state.allReviewsError = null;
      })
      .addCase(fetchAllReviews.fulfilled, (state, action) => {
        state.allReviewsStatus = 'succeeded';
        state.allReviews = action.payload;
      })
      .addCase(fetchAllReviews.rejected, (state, action) => {
        state.allReviewsStatus = 'failed';
        state.allReviewsError = action.payload;
      })

      // addReview
      .addCase(addReview.fulfilled, (state, action) => {
        const newReview = action.payload;
        // Add the new review to the specific book's reviewsByBookId array
        if (state.reviewsByBookId[newReview.bookId]) {
          state.reviewsByBookId[newReview.bookId].push(newReview);
        } else {
          // If this is the first review for this book (or reviews not yet loaded)
          state.reviewsByBookId[newReview.bookId] = [newReview];
        }
        // Also update allReviews if you use it for a live-updating admin list
        state.allReviews.push(newReview); // Assuming allReviews needs to reflect this
      })
      .addCase(addReview.rejected, (state, action) => {
        // Handle error if adding review fails (e.g., set a global error state or display a toast)
        // For simplicity, we're not setting a specific error state for this action here,
        // but you might want to.
      })

      // updateReview
      .addCase(updateReview.fulfilled, (state, action) => {
        const updatedReview = action.payload;
        // Find and update the review in the specific book's reviewsByBookId array
        if (state.reviewsByBookId[updatedReview.bookId]) {
          const reviewsForBook = state.reviewsByBookId[updatedReview.bookId];
          const index = reviewsForBook.findIndex((review) => review.id === updatedReview.id);
          if (index !== -1) {
            reviewsForBook[index] = updatedReview;
          }
        }
        // Also update allReviews
        const allReviewIndex = state.allReviews.findIndex(r => r.id === updatedReview.id);
        if (allReviewIndex !== -1) {
            state.allReviews[allReviewIndex] = updatedReview;
        }
      })
      .addCase(updateReview.rejected, (state, action) => {
        // Handle error if updating review fails
      })

      // deleteReview
      .addCase(deleteReview.fulfilled, (state, action) => {
        const deletedReviewId = action.payload;
        // This is tricky: `deleteReview` returns only the ID.
        // To correctly update `reviewsByBookId`, you ideally need the `bookId`
        // of the deleted review.
        // Option 1: Iterate through all book's reviews (less efficient)
        Object.keys(state.reviewsByBookId).forEach(bookId => {
          state.reviewsByBookId[bookId] = state.reviewsByBookId[bookId].filter(
            (review) => review.id !== deletedReviewId
          );
        });
        // Option 2 (Better): If your backend delete endpoint could return the bookId,
        // or if you pass it as an argument to the thunk:
        // const { reviewId, bookId } = action.payload; // If payload was { reviewId, bookId }
        // if (state.reviewsByBookId[bookId]) {
        //   state.reviewsByBookId[bookId] = state.reviewsByBookId[bookId].filter(
        //     (review) => review.id !== reviewId
        //   );
        // }
        // Also update allReviews
        state.allReviews = state.allReviews.filter(r => r.id !== deletedReviewId);
      })
      .addCase(deleteReview.rejected, (state, action) => {
        // Handle error if deleting review fails
      })

      // moderateReview (assuming moderated review includes bookId)
      .addCase(moderateReview.fulfilled, (state, action) => {
        const moderatedReview = action.payload;
        if (state.reviewsByBookId[moderatedReview.bookId]) {
          const reviewsForBook = state.reviewsByBookId[moderatedReview.bookId];
          const index = reviewsForBook.findIndex((review) => review.id === moderatedReview.id);
          if (index !== -1) {
            reviewsForBook[index] = moderatedReview;
          }
        }
        // Also update allReviews
        const allReviewIndex = state.allReviews.findIndex(r => r.id === moderatedReview.id);
        if (allReviewIndex !== -1) {
            state.allReviews[allReviewIndex] = moderatedReview;
        }
      })
      .addCase(moderateReview.rejected, (state, action) => {
        // Handle moderation failure
      });
  },
});

export default reviewSlice.reducer;