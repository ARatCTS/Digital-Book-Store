import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import bookReducer from './bookSlice';
import cartReducer from './cartSlice';
import orderReducer from './orderSlice';
import reviewReducer from './reviewSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    books: bookReducer,
    cart: cartReducer,
    orders: orderReducer,
    reviews: reviewReducer,
  },
});
