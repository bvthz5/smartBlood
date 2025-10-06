import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const loginAdmin = createAsyncThunk(
  'admin/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post('/admin/auth/login', { email, password });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Login failed');
    }
  }
);

export const fetchDashboardData = createAsyncThunk(
  'admin/fetchDashboardData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/dashboard/');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch dashboard data');
    }
  }
);

const initialState = {
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null,
  isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('adminToken') : false,
  isLoading: false,
  error: null,
  dashboardData: {
    stats: {
      totalDonors: 0,
      activeDonors: 0,
      hospitals: 0,
      openRequests: 0,
      urgentRequests: 0,
      donationsToday: 0,
    },
    charts: {
      requestsOverTime: [],
      bloodGroupDistribution: [],
      requestsByDistrict: [],
    },
    recentEmergencies: [],
    topHospitals: [],
    topDonors: [],
  },
  darkMode: false,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.dashboardData = initialState.dashboardData;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('adminToken');
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    setDashboardData: (state, action) => {
      state.dashboardData = { ...state.dashboardData, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.admin;
        state.token = action.payload.access_token;
        state.error = null;
        if (typeof window !== 'undefined') {
          localStorage.setItem('adminToken', action.payload.access_token);
        }
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Dashboard data cases
      .addCase(fetchDashboardData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dashboardData = action.payload;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError, toggleDarkMode, setDashboardData } = adminSlice.actions;
export default adminSlice.reducer;
