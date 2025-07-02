import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../api/apiClient';


export const fetchReviewsByBookId = createAsyncThunk(
  'reviews/fetchReviewsByBookId',
  async (bookId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/api/reviews/book/${bookId}`);
      return { bookId, reviews: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchAllReviews = createAsyncThunk(
  'reviews/fetchAllReviews',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/api/reviews/admin'); 
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

      await apiClient.delete(`/api/reviews/${reviewId}`);
      return reviewId; 
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

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
  reviewsByBookId: {}, 
  statuses: {}, 
  errors: {},    
  allReviews: [],
  allReviewsStatus: 'idle',
  allReviewsError: null,
};

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviewsByBookId.pending, (state, action) => {
        const bookId = action.meta.arg; 
        state.statuses[bookId] = 'loading';
        state.errors[bookId] = null; 
      })
      .addCase(fetchReviewsByBookId.fulfilled, (state, action) => {
        const { bookId, reviews } = action.payload; 
        state.statuses[bookId] = 'succeeded';
        state.reviewsByBookId[bookId] = reviews; 
      })
      .addCase(fetchReviewsByBookId.rejected, (state, action) => {
        const bookId = action.meta.arg;
        state.statuses[bookId] = 'failed';
        state.errors[bookId] = action.payload; 
        state.reviewsByBookId[bookId] = []; 

      })

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

      .addCase(addReview.fulfilled, (state, action) => {
        const newReview = action.payload;
        if (state.reviewsByBookId[newReview.bookId]) {
          state.reviewsByBookId[newReview.bookId].push(newReview);
        } else {
          state.reviewsByBookId[newReview.bookId] = [newReview];
        }
        state.allReviews.push(newReview); 
      })
      .addCase(addReview.rejected, (state, action) => {

      })

      .addCase(updateReview.fulfilled, (state, action) => {
        const updatedReview = action.payload;
        if (state.reviewsByBookId[updatedReview.bookId]) {
          const reviewsForBook = state.reviewsByBookId[updatedReview.bookId];
          const index = reviewsForBook.findIndex((review) => review.id === updatedReview.id);
          if (index !== -1) {
            reviewsForBook[index] = updatedReview;
          }
        }
        const allReviewIndex = state.allReviews.findIndex(r => r.id === updatedReview.id);
        if (allReviewIndex !== -1) {
            state.allReviews[allReviewIndex] = updatedReview;
        }
      })
      .addCase(updateReview.rejected, (state, action) => {
      })

      .addCase(deleteReview.fulfilled, (state, action) => {
        const deletedReviewId = action.payload;

        Object.keys(state.reviewsByBookId).forEach(bookId => {
          state.reviewsByBookId[bookId] = state.reviewsByBookId[bookId].filter(
            (review) => review.id !== deletedReviewId
          );
        });

        state.allReviews = state.allReviews.filter(r => r.id !== deletedReviewId);
      })
      .addCase(deleteReview.rejected, (state, action) => {
      })

      .addCase(moderateReview.fulfilled, (state, action) => {
        const moderatedReview = action.payload;
        if (state.reviewsByBookId[moderatedReview.bookId]) {
          const reviewsForBook = state.reviewsByBookId[moderatedReview.bookId];
          const index = reviewsForBook.findIndex((review) => review.id === moderatedReview.id);
          if (index !== -1) {
            reviewsForBook[index] = moderatedReview;
          }
        }
        const allReviewIndex = state.allReviews.findIndex(r => r.id === moderatedReview.id);
        if (allReviewIndex !== -1) {
            state.allReviews[allReviewIndex] = moderatedReview;
        }
      })
      .addCase(moderateReview.rejected, (state, action) => {
      });
  },
});

export default reviewSlice.reducer;