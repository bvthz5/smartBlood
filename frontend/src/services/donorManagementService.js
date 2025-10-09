import api from './api';

const donorManagementService = {
  // Get all donors with search, filter, and pagination
  getDonors: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.search) queryParams.append('search', params.search);
    if (params.blood_group) queryParams.append('blood_group', params.blood_group);
    if (params.status) queryParams.append('status', params.status);
    if (params.availability) queryParams.append('availability', params.availability);
    if (params.page) queryParams.append('page', params.page);
    if (params.per_page) queryParams.append('per_page', params.per_page);
    
    const response = await api.get(`/admin/donors?${queryParams.toString()}`);
    return response.data;
  },

  // Update donor information
  updateDonor: async (donorId, donorData) => {
    const response = await api.put(`/admin/donors/${donorId}`, donorData);
    return response.data;
  },

  // Delete donor (soft delete)
  deleteDonor: async (donorId) => {
    const response = await api.delete(`/admin/donors/${donorId}`);
    return response.data;
  },

  // Block or unblock donor
  blockDonor: async (donorId, action = 'block') => {
    const response = await api.post(`/admin/donors/${donorId}/block`, { action });
    return response.data;
  },

  // Get donor statistics
  getDonorStats: async () => {
    const response = await api.get('/admin/donors/stats');
    return response.data;
  }
};

export default donorManagementService;
