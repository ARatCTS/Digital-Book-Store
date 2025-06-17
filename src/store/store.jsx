import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice'; // Assuming you have an authSlice
import bookReducer from './bookSlice'; // Assuming you have a bookSlice
import orderReducer from './orderSlice'; // Assuming you have an orderSlice
import reviewReducer from './reviewSlice'; // <-- Make sure this is imported!

export const store = configureStore({
  reducer: {
    auth: authReducer, // Name it 'auth' if that's how you access it in useSelector (state.auth)
    books: bookReducer, // Name it 'books' (state.books)
    orders: orderReducer, // Name it 'orders' (state.orders)
    reviews: reviewReducer, // <-- Make sure this is correctly named 'reviews'! (state.reviews)
    // Add other reducers here as you create them (e.g., categories, users)
  },
  // Middleware, devTools options can go here if needed
});

export default store;