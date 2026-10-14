import axios from 'axios';
import { API_CONFIG } from './config';

// ============================================================
// Axios HTTP Client
// Provides request/response interceptors, auth token injection,
// and consistent error handling for real backend integration.
// Not called in mock mode — repositories guard against this.
// ============================================================

const httpClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Request Interceptor: attach JWT token ---
httpClient.interceptors.request.use(
  (config) => {
    // Token is stored in memory (not localStorage) for security
    const token = sessionStorage.getItem('_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Response Interceptor: normalize errors ---
httpClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred';

    if (status === 401) {
      // Token expired — clear session and redirect to login
      sessionStorage.removeItem('_auth_token');
      window.location.href = '/login';
    }

    const normalized = {
      status,
      message,
      errors: error.response?.data?.errors || [],
    };

    return Promise.reject(normalized);
  }
);

export default httpClient;
