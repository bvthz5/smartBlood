import api from './api';

const seekerService = {
  login: async (email_or_phone, password) => {
    const res = await api.post('/api/auth/seeker-login', { email_or_phone, password });
    return res.data;
  },
  activate: async (old_password, new_password) => {
    const temp = typeof window !== 'undefined' ? localStorage.getItem('seeker_temp_token') : null;
    const res = await api.post('/api/seeker/activate', { old_password, new_password }, {
      headers: temp ? { Authorization: `Bearer ${temp}` } : {}
    });
    return res.data;
  },
  dashboard: async () => {
    const res = await api.get('/api/seeker/dashboard');
    return res.data;
  },
  createRequest: async (payload) => {
    // Backend expects: blood_group, units_required, urgency, location
    const res = await api.post('/api/requests', payload);
    return res.data;
  },
  listRequests: async (params = {}) => {
    const queryObj = { ...params };
    if (queryObj.mine === undefined) queryObj.mine = true;
    const query = new URLSearchParams(queryObj).toString();
    const res = await api.get(`/api/requests${query ? `?${query}` : ''}`);
    return res.data;
  },
  listMatches: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await api.get(`/api/seeker/matches${query ? `?${query}` : ''}`);
    return res.data;
  },
  getHospital: async () => {
    const res = await api.get('/api/seeker/hospital');
    return res.data;
  },
  updateHospital: async (payload) => {
    const res = await api.put('/api/seeker/hospital', payload);
    return res.data;
  }
};

export default seekerService;
