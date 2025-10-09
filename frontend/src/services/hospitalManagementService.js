import api from './api';

const hospitalManagementService = {
  // Get all hospitals with search, filter, and pagination
  getHospitals: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.search) queryParams.append('search', params.search);
    if (params.district) queryParams.append('district', params.district);
    if (params.city) queryParams.append('city', params.city);
    if (params.is_verified) queryParams.append('is_verified', params.is_verified);
    if (params.page) queryParams.append('page', params.page);
    if (params.per_page) queryParams.append('per_page', params.per_page);
    
    const response = await api.get(`/admin/hospitals?${queryParams.toString()}`);
    return response.data;
  },

  // Create a new hospital
  createHospital: async (hospitalData) => {
    const response = await api.post('/admin/hospitals', hospitalData);
    return response.data;
  },

  // Update hospital information
  updateHospital: async (hospitalId, hospitalData) => {
    const response = await api.put(`/admin/hospitals/${hospitalId}`, hospitalData);
    return response.data;
  },

  // Delete hospital
  deleteHospital: async (hospitalId) => {
    const response = await api.delete(`/admin/hospitals/${hospitalId}`);
    return response.data;
  },

  // Get hospital statistics
  getHospitalStats: async () => {
    const response = await api.get('/admin/hospitals/stats');
    return response.data;
  }
};

export default hospitalManagementService;

