import api from './api';

const donationRequestsService = {
  // Get all donation requests with search, filter, and pagination
  getRequests: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.search) queryParams.append('search', params.search);
    if (params.blood_group) queryParams.append('blood_group', params.blood_group);
    if (params.hospital_id) queryParams.append('hospital_id', params.hospital_id);
    if (params.urgency) queryParams.append('urgency', params.urgency);
    if (params.status) queryParams.append('status', params.status);
    if (params.page) queryParams.append('page', params.page);
    if (params.per_page) queryParams.append('per_page', params.per_page);
    
    const response = await api.get(`/admin/requests?${queryParams.toString()}`);
    return response.data;
  },

  // Get detailed information about a specific request
  getRequestDetails: async (requestId) => {
    const response = await api.get(`/admin/requests/${requestId}`);
    return response.data;
  },

  // Update request status (cancel, close, etc.)
  updateRequestStatus: async (requestId, status) => {
    const response = await api.put(`/admin/requests/${requestId}/status`, {
      status
    });
    return response.data;
  },

  // Manually assign a donor to a request
  assignDonorToRequest: async (requestId, donorId) => {
    const response = await api.post(`/admin/requests/${requestId}/assign-donor`, {
      donor_id: donorId
    });
    return response.data;
  },

  // Get request statistics
  getRequestStats: async () => {
    const response = await api.get('/admin/requests/stats');
    return response.data;
  }
};

export default donationRequestsService;
