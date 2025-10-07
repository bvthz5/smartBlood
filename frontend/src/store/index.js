import { configureStore } from '@reduxjs/toolkit';
import adminReducer from './slices/adminSlice';

// Check if we're in development mode
const isDevelopment = import.meta.env.DEV;

export const store = configureStore({
  reducer: {
    admin: adminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Disable serializable check in development for better performance
      serializableCheck: isDevelopment ? false : {
        // Ignore these action types
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/PURGE',
          'persist/REGISTER',
          'persist/FLUSH',
        ],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: [
          'admin.dashboardData.charts',
          'admin.dashboardData.recentEmergencies',
          'admin.dashboardData.topHospitals',
        ],
        // Increase the warning threshold
        warnAfter: 128,
      },
      // Disable immutable check in development for better performance
      immutableCheck: isDevelopment ? false : {
        warnAfter: 128,
      },
    }),
});

// TypeScript types removed for JavaScript compatibility
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
