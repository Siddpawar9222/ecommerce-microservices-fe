// ============================================================
// API Configuration & Mode Toggle
// VITE_USE_MOCK=true  → uses mock repositories (default)
// VITE_USE_MOCK=false → uses HTTP repositories (real backend)
// ============================================================

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  USE_MOCK: import.meta.env.VITE_USE_MOCK !== 'false', // default true
  TIMEOUT: 10000,
  MOCK_DELAY_MS: 600, // simulates network latency in mock mode
};

export const isMockMode = () => API_CONFIG.USE_MOCK;
