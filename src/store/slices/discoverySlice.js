import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profiles: [],
  isLoading: false,
  error: null,
  filters: {
    industries: [],
    stages: [],
    locations: [],
    archetypes: [],
    skills: [],
    minCompatibilityScore: 0,
    availability: []
  },
  pagination: {
    page: 0,
    limit: 20,
    total: 0,
    totalPages: 0
  }
};

const discoverySlice = createSlice({
  name: 'discovery',
  initialState,
  reducers: {
    setProfiles: (state, action) => {
      state.profiles = action.payload;
    },
    addProfiles: (state, action) => {
      state.profiles = [...state.profiles, ...action.payload];
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
});

export const { 
  setProfiles, 
  addProfiles, 
  setLoading, 
  setError, 
  setFilters, 
  clearFilters, 
  setPagination 
} = discoverySlice.actions;
export default discoverySlice.reducer;
