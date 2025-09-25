// src/api.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:5000";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

// attach access token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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

export async function createRequest(payload) {
  return api.post("/api/requests", payload);
}
export async function listRequests(mine = false) {
  return api.get(`/api/requests?mine=${mine}`);
}

// admin: generate matches (dev)
export async function adminGenerateMatches(payload) {
  return api.post("/admin/match/generate", payload);
}

export default api;
