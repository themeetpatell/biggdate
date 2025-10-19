import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';

// Import reducers
import authReducer from './slices/authSlice.js';
import profileReducer from './slices/profileSlice.js';
import discoveryReducer from './slices/discoverySlice.js';
import connectionsReducer from './slices/connectionsSlice.js';

// Persist config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'profile'] // Only persist auth and profile data
};

const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  discovery: discoveryReducer,
  connections: connectionsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);
