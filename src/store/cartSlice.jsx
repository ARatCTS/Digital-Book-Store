import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: JSON.parse(localStorage.getItem('cartItems')) || [],

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
    incrementQuantity(state, action) {
      const id = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      if (existingItem) {
        existingItem.quantity++;
      }
      localStorage.setItem('cartItems', JSON.stringify(state.items));
    },
    decrementQuantity(state, action) {
      const id = action.payload;
      const existingItem = state.items.find(item => item.id === id);
      if (existingItem && existingItem.quantity > 1) {
        existingItem.quantity--;
      } else if (existingItem && existingItem.quantity === 1) {
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
  incrementQuantity, 
  decrementQuantity, 
  clearCart
} = cartSlice.actions;

export default cartSlice.reducer;