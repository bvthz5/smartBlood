import api from './api';

// ID encoding utilities
export const encodeId = (id) => {
  try {
    // Convert to string and encode to base64
    const encoded = btoa(id.toString());
    // Make URL-safe by replacing characters
    return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  } catch (error) {
    throw new Error(`Failed to encode ID ${id}: ${error.message}`);
  }
};

export const decodeId = (encodedId) => {
  try {
    // Add padding back if needed
    let padded = encodedId;
    const paddingNeeded = padded.length % 4;
    if (paddingNeeded) {
      padded += '='.repeat(4 - paddingNeeded);
    }
    
    // Replace URL-safe characters back
    padded = padded.replace(/-/g, '+').replace(/_/g, '/');
    
    // Decode and convert back to integer
    const decoded = atob(padded);
    return parseInt(decoded, 10);
  } catch (error) {
    throw new Error(`Failed to decode ID '${encodedId}': ${error.message}`);
  }
};

export const donorService = {
  getProfile: async () => {
    const response = await api.get('/api/donors/me');
    return response.data;
  },

  getProfileById: async (encodedId) => {
    const response = await api.get(`/api/donors/profile/${encodedId}`);
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/api/donors/me', profileData);
    return response.data;
  },

  getDashboard: async () => {
    const response = await api.get('/api/donors/dashboard');
    return response.data;
  },

  getDonationHistory: async () => {
    const response = await api.get('/api/donors/donations');
    return response.data;
  }
};
