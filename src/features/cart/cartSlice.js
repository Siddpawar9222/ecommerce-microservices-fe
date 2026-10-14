import { createSlice } from '@reduxjs/toolkit';

// ============================================================
// Cart Slice — manages shopping cart with localStorage persistence
// ============================================================

const CART_STORAGE_KEY = 'shophub_cart';

const loadCartFromStorage = () => {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : { items: [] };
  } catch {
    return { items: [] };
  }
};

const saveCartToStorage = (items) => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ items }));
};

const initialState = loadCartFromStorage();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const { product, quantity = 1 } = action.payload;
      const existing = state.items.find((i) => i.productId === product.id);

      if (existing) {
        existing.quantity = Math.min(existing.quantity + quantity, 10);
      } else {
        state.items.push({
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || null,
          quantity: Math.min(quantity, 10),
        });
      }
      saveCartToStorage(state.items);
    },

    removeFromCart(state, action) {
      state.items = state.items.filter((i) => i.productId !== action.payload);
      saveCartToStorage(state.items);
    },

    updateQuantity(state, action) {
      const { productId, quantity } = action.payload;
      const item = state.items.find((i) => i.productId === productId);
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((i) => i.productId !== productId);
        } else {
          item.quantity = Math.min(quantity, 10);
        }
      }
      saveCartToStorage(state.items);
    },

    clearCart(state) {
      state.items = [];
      saveCartToStorage(state.items);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

// --- Selectors ---
export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.quantity, 0);
export const selectCartSubtotal = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
export const selectCartTotal = (state) => {
  const subtotal = selectCartSubtotal(state);
  const shipping = subtotal >= 100 ? 0 : 5.99;
  const tax = parseFloat((subtotal * 0.09).toFixed(2));
  return { subtotal, shipping, tax, total: parseFloat((subtotal + shipping + tax).toFixed(2)) };
};
export const selectIsInCart = (productId) => (state) =>
  state.cart.items.some((i) => i.productId === productId);

export default cartSlice.reducer;
