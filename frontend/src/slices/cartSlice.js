import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api.js';

export const fetchCart = createAsyncThunk('cart/fetch', async () => {
  const { data } = await api.get('/cart');
  return data.cart;
});
export const addToCart = createAsyncThunk('cart/add', async ({ productId, quantity }) => {
  const { data } = await api.post('/cart/add', { productId, quantity });
  return data.cart;
});
export const updateCartQty = createAsyncThunk('cart/update', async ({ productId, quantity }) => {
  const { data } = await api.put('/cart/update', { productId, quantity });
  return data.cart;
});
export const removeCartItem = createAsyncThunk('cart/remove', async (productId) => {
  const { data } = await api.delete(`/cart/remove/${productId}`);
  return data.cart;
});
export const clearCart = createAsyncThunk('cart/clear', async () => {
  await api.delete('/cart/clear');
  return [];
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], loading: false },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchCart.fulfilled, (s, a) => { s.items = a.payload?.items || []; })
     .addCase(addToCart.fulfilled, (s, a) => { s.items = a.payload?.items || []; })
     .addCase(updateCartQty.fulfilled, (s, a) => { s.items = a.payload?.items || []; })
     .addCase(removeCartItem.fulfilled, (s, a) => { s.items = a.payload?.items || []; })
     .addCase(clearCart.fulfilled, (s) => { s.items = []; });
  },
});

export default cartSlice.reducer;