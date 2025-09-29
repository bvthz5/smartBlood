import api from './api';

export const donorService = {
  getProfile: async () => {
    const response = await api.get('/donor/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/donor/profile', profileData);
    return response.data;
  },

  getDashboard: async () => {
    const response = await api.get('/donor/dashboard');
    return response.data;
  },

  getDonationHistory: async () => {
    const response = await api.get('/donor/donations');
    return response.data;
  }
};
