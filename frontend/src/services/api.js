import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('adminToken');
        // Check if it's an admin route
        if (window.location.pathname.startsWith('/admin')) {
          window.location.href = '/admin/login';
        } else {
          window.location.href = '/donor/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Authentication functions
export async function registerDonor(payload) {
  return api.post("/api/auth/register", payload);
}

export async function verifyOtp(payload) {
  return api.post("/api/auth/verify-otp", payload);
}

export async function login(payload) {
  return api.post("/api/auth/login", payload);
}

export async function refreshToken(refreshToken) {
  return api.post("/api/auth/refresh", { refresh_token: refreshToken });
}

// Donor functions
export async function getDonorProfile() {
  return api.get("/api/donors/me");
}

export async function updateDonorProfile(data) {
  return api.put("/api/donors/me", data);
}

export async function setAvailability(status) {
  return api.post("/api/donors/availability", { status });
}

export async function getDonorMatches() {
  return api.get("/api/donors/matches");
}

export async function respondToMatch(matchId, action) {
  return api.post("/api/donors/respond", { match_id: matchId, action });
}

// Request functions
export async function createRequest(payload) {
  return api.post("/api/requests", payload);
}

export async function listRequests(mine = false) {
  return api.get(`/api/requests?mine=${mine}`);
}

// Admin functions
export async function adminGenerateMatches(payload) {
  return api.post("/admin/match/generate", payload);
}

export default api;
