import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api.js';

export const fetchWishlist = createAsyncThunk('wishlist/fetch', async () => {
  const { data } = await api.get('/wishlist');
  return data.wishlist;
});
export const toggleWishlist = createAsyncThunk('wishlist/toggle', async (productId) => {
  const { data } = await api.post('/wishlist/toggle', { productId });
  return data.wishlist;
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { products: [] },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchWishlist.fulfilled, (s, a) => { s.products = a.payload?.products || []; })
     .addCase(toggleWishlist.fulfilled, (s, a) => { s.products = a.payload?.products || []; });
  },
});

export default wishlistSlice.reducer;