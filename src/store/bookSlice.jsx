import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../api/apiClient';

export const fetchBooks = createAsyncThunk('books/fetchBooks', async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.get('/api/books/browse');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const addBook = createAsyncThunk('books/addBook', async (bookData, { rejectWithValue }) => {
    try {
        const response = await apiClient.post('/api/books', bookData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const updateBook = createAsyncThunk('books/updateBook', async ({ id, bookData }, { rejectWithValue }) => {
    try {
        const response = await apiClient.put(`/api/books/${id}`, bookData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const deleteBook = createAsyncThunk('books/deleteBook', async (id, { rejectWithValue }) => {
    try {
        await apiClient.delete(`/api/books/${id}`);
        return id;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});


const initialState = {
  items: [],
  status: 'idle',
  error: null,
};

const bookSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addBook.fulfilled, (state, action) => {
          state.items.push(action.payload);
      })
      .addCase(updateBook.fulfilled, (state, action) => {
          const index = state.items.findIndex(book => book.id === action.payload.id);
          if (index !== -1) {
              state.items[index] = action.payload;
          }
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
          state.items = state.items.filter(book => book.id !== action.payload);
      });
  },
});

export default bookSlice.reducer;


