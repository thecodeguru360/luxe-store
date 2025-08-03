import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { type Product, type ProductType } from '@shared/schema';

interface ProductFilters {
  type?: ProductType;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
}

interface ProductState {
  filters: ProductFilters;
  searchQuery: string;
  sortBy: string;
}

const initialState: ProductState = {
  filters: {},
  searchQuery: '',
  sortBy: 'featured',
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<ProductFilters>) => {
      state.filters = action.payload;
    },
    updateFilter: (state, action: PayloadAction<{ key: keyof ProductFilters; value: any }>) => {
      state.filters[action.payload.key] = action.payload.value;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
    },
  },
});

export const { setFilters, updateFilter, clearFilters, setSearchQuery, setSortBy } = productSlice.actions;
export default productSlice.reducer;
