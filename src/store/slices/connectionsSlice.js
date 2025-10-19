import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  connections: [],
  matches: [],
  isLoading: false,
  error: null,
};

const connectionsSlice = createSlice({
  name: 'connections',
  initialState,
  reducers: {
    setConnections: (state, action) => {
      state.connections = action.payload;
    },
    addConnection: (state, action) => {
      state.connections.push(action.payload);
    },
    updateConnection: (state, action) => {
      const index = state.connections.findIndex(conn => conn.id === action.payload.id);
      if (index !== -1) {
        state.connections[index] = action.payload;
      }
    },
    removeConnection: (state, action) => {
      state.connections = state.connections.filter(conn => conn.id !== action.payload);
    },
    setMatches: (state, action) => {
      state.matches = action.payload;
    },
    addMatch: (state, action) => {
      state.matches.push(action.payload);
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { 
  setConnections, 
  addConnection, 
  updateConnection, 
  removeConnection,
  setMatches,
  addMatch,
  setLoading, 
  setError 
} = connectionsSlice.actions;
export default connectionsSlice.reducer;
