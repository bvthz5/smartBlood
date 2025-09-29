import api from './api';

export const requestService = {
  createRequest: async (requestData) => {
    const response = await api.post('/requests', requestData);
    return response.data;
  },

  getRequests: async () => {
    const response = await api.get('/requests');
    return response.data;
  },

  getRequest: async (id) => {
    const response = await api.get(`/requests/${id}`);
    return response.data;
  },

  updateRequest: async (id, requestData) => {
    const response = await api.put(`/requests/${id}`, requestData);
    return response.data;
  },

  deleteRequest: async (id) => {
    const response = await api.delete(`/requests/${id}`);
    return response.data;
  }
};
