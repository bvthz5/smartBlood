import api from './api';

const bloodMatchingService = {
  // Get all blood matches with search, filter, and pagination
  getMatches: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);
    if (params.blood_group) queryParams.append('blood_group', params.blood_group);
    if (params.urgency) queryParams.append('urgency', params.urgency);
    if (params.page) queryParams.append('page', params.page);
    if (params.per_page) queryParams.append('per_page', params.per_page);
    
    const response = await api.get(`/admin/matches?${queryParams.toString()}`);
    return response.data;
  },

  // Update match status (accept, decline, complete)
  updateMatchStatus: async (matchId, status, notes = '') => {
    const response = await api.put(`/admin/matches/${matchId}/status`, {
      status,
      notes
    });
    return response.data;
  },

  // Get match statistics
  getMatchStats: async () => {
    const response = await api.get('/admin/matches/stats');
    return response.data;
  }
};

export default bloodMatchingService;
