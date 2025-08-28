import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import booksReducer from './slices/bookSlice';
import lendingReducer from './slices/lendingSlice';
import uiReducer from './slices/uiSlice';
// import storage from 'redux-persist/lib/storage';
// import { persistReducer } from 'redux-persist';



// const persistConfig = {
//     key: 'root',
//     storage,
//     whitelist: ['auth'], // Only persist auth state
//   };
  
// const rootReducer = combineReducers({
//     auth: authReducer,
//     books: booksReducer,
//     lending: lendingReducer,
//     ui: uiReducer,
//   });
  
// const persistedReducer = persistReducer(persistConfig, rootReducer);
  
// Configure the Redux store
export const store = configureStore({
  // Combine all your reducers here
  reducer: {
    auth: authReducer,        // Authentication state (user, token, login status)
    books: booksReducer,      // Books management (add, edit, delete, list)
    lending: lendingReducer,  // Lending operations (borrow, return, history)
    ui: uiReducer,           // UI state (sidebar, theme, notifications)
  },
  
  // Configure middleware
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Ignore serialization checks for certain actions
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  
  // Enable Redux DevTools in development
  devTools: process.env.NODE_ENV !== 'production',
});

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Optional: Export store for direct access if needed
export default store;