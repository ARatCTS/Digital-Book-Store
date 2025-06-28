// /src/store/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: JSON.parse(localStorage.getItem('cartItems')) || [],
  // totalQuantity and totalAmount are often calculated in the selector or on the fly
  // but if you want to store them in state and keep them updated, you'd add logic to reducers.
  // For simplicity and less potential for bugs, I'll keep them out of state here
  // and suggest calculating them dynamically as you were in the CartPage component.
  // totalQuantity: 0,
  // totalAmount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItemToCart(state, action) {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.id === newItem.id);
      if (!existingItem) {
        state.items.push({ ...newItem, quantity: 1 });
      } else {
        existingItem.quantity++;
      }
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    removeItemFromCart(state, action) {
      const id = action.payload;
      state.items = state.items.filter(item => item.id !== id);
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    // New: Increment item quantity
    incrementQuantity(state, action) {
      const id = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      if (existingItem) {
        existingItem.quantity++;
      }
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    // New: Decrement item quantity
    decrementQuantity(state, action) {
      const id = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      if (existingItem && existingItem.quantity > 1) {
        existingItem.quantity--;
      } else if (existingItem && existingItem.quantity === 1) {
        // Option to remove item if quantity drops to 0 or below 1
        state.items = state.items.filter(item => item.id !== id);
      }
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    clearCart(state) {
        state.items = [];
        localStorage.removeItem('cartItems');
    }
  },
});

export const {
  addItemToCart,
  removeItemFromCart,
  incrementQuantity, // Export the new action
  decrementQuantity, // Export the new action
  clearCart
} = cartSlice.actions;

export default cartSlice.reducer;