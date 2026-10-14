// ============================================================
// HTTP Auth Repository — Spring Boot Identity Service
// Implements the same contract as mockAuthRepository.
// Activate by setting VITE_USE_MOCK=false
// ============================================================

import httpClient from '../api/httpClient';
import { AUTH_ENDPOINTS } from '../api/endpoints';

const login = async ({ email, password }) => {
  // POST /api/auth/login → { user: {...}, token: '...' }
  return httpClient.post(AUTH_ENDPOINTS.LOGIN, { email, password });
};

const getCurrentUser = async () => {
  // GET /api/auth/me → { id, name, email, role, ... }
  return httpClient.get(AUTH_ENDPOINTS.ME);
};

const logout = async () => {
  // POST /api/auth/logout → { success: true }
  return httpClient.post(AUTH_ENDPOINTS.LOGOUT);
};

export const httpAuthRepository = {
  login,
  getCurrentUser,
  logout,
};
