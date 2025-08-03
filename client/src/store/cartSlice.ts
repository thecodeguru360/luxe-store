import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  product_id: number;
  quantity: number;
  selected_size?: string;
  selected_color?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

const initialState: CartState = {
  items: [],
  isOpen: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(item => item.product_id === action.payload.product_id);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.product_id !== action.payload);
    },
    updateQuantity: (state, action: PayloadAction<{ product_id: number; quantity: number }>) => {
      const item = state.items.find(item => item.product_id === action.payload.product_id);
      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter(item => item.product_id !== action.payload.product_id);
        } else {
          item.quantity = action.payload.quantity;
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
    setCartOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, toggleCart, setCartOpen } = cartSlice.actions;
export default cartSlice.reducer;
