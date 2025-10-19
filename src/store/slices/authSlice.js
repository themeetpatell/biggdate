import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Mock API functions for now
const mockAuthApi = {
  login: async (credentials) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful login
    return {
      user: {
        id: '1',
        email: credentials.email,
        firstName: 'John',
        lastName: 'Doe',
        profileImage: null,
        isVerified: true,
        safetyScore: 95,
        premiumTier: 'gold',
        globalLocation: {
          country: 'United States',
          city: 'San Francisco',
          timezone: 'PST',
          coordinates: { lat: 37.7749, lng: -122.4194 },
          region: 'North America',
          language: 'English'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token'
    };
  },
  
  register: async (userData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful registration
    return {
      user: {
        id: '1',
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        profileImage: null,
        isVerified: false,
        safetyScore: 80,
        premiumTier: 'free',
        globalLocation: {
          country: 'United States',
          city: 'San Francisco',
          timezone: 'PST',
          coordinates: { lat: 37.7749, lng: -122.4194 },
          region: 'North America',
          language: 'English'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token'
    };
  },
  
  logout: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  }
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      console.log('loginUser thunk - credentials:', credentials);
      const data = await mockAuthApi.login(credentials);
      console.log('loginUser thunk - data received:', data);
      
      // Store tokens in localStorage
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      
      return data;
    } catch (error) {
      console.error('loginUser thunk - error:', error);
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await mockAuthApi.register(userData);
      
      // Store tokens in localStorage
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      console.log('logoutUser thunk - starting logout');
      await mockAuthApi.logout();
      console.log('logoutUser thunk - API logout successful');
      
      // Clear tokens from localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      console.log('logoutUser thunk - localStorage cleared');
    } catch (error) {
      console.error('logoutUser thunk - error:', error);
      // Even if API call fails, clear local state
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      return rejectWithValue(error.message || 'Logout failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
    initializeAuth: (state) => {
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        console.log('logoutUser.fulfilled - resetting auth state');
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      });
  },
});

export const { clearError, setCredentials, clearCredentials, initializeAuth } = authSlice.actions;
export default authSlice.reducer;
