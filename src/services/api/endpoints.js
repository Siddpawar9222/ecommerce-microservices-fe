// ============================================================
// REST Endpoint Contracts
// Each constant maps to a future Spring Boot microservice route.
// Owner service is noted per group.
// ============================================================

const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// --- Identity Service ---
// Spring Boot Service: identity-service  (via API Gateway /api/auth/**)
export const AUTH_ENDPOINTS = {
  LOGIN: `${BASE}/auth/login`,
  LOGOUT: `${BASE}/auth/logout`,
  REFRESH: `${BASE}/auth/refresh`,
  ME: `${BASE}/auth/me`,
  REGISTER: `${BASE}/auth/register`,
};

// --- Product Service ---
// Spring Boot Service: product-service  (via API Gateway /api/products/**)
export const PRODUCT_ENDPOINTS = {
  LIST: `${BASE}/products`,
  DETAIL: (id) => `${BASE}/products/${id}`,
  CREATE: `${BASE}/products`,
  UPDATE: (id) => `${BASE}/products/${id}`,
  DELETE: (id) => `${BASE}/products/${id}`,
  SEARCH: `${BASE}/products/search`,
  CATEGORIES: `${BASE}/products/categories`,
  FEATURED: `${BASE}/products/featured`,
};

// --- Order Service ---
// Spring Boot Service: order-service  (via API Gateway /api/orders/**)
export const ORDER_ENDPOINTS = {
  LIST: `${BASE}/orders`,
  MY_ORDERS: `${BASE}/orders/my`,
  DETAIL: (id) => `${BASE}/orders/${id}`,
  CREATE: `${BASE}/orders`,
  CANCEL: (id) => `${BASE}/orders/${id}/cancel`,
  STATUS: (id) => `${BASE}/orders/${id}/status`,
};

// --- Inventory Service ---
// Spring Boot Service: inventory-service  (via API Gateway /api/inventory/**)
export const INVENTORY_ENDPOINTS = {
  LIST: `${BASE}/inventory`,
  DETAIL: (productId) => `${BASE}/inventory/${productId}`,
  UPDATE_STOCK: (productId) => `${BASE}/inventory/${productId}/stock`,
  LOW_STOCK: `${BASE}/inventory/low-stock`,
  RESERVATIONS: `${BASE}/inventory/reservations`,
};

// --- Payment Service ---
// Spring Boot Service: payment-service (planned)  (via API Gateway /api/payments/**)
export const PAYMENT_ENDPOINTS = {
  INITIATE: `${BASE}/payments/initiate`,
  STATUS: (paymentId) => `${BASE}/payments/${paymentId}/status`,
  MY_PAYMENTS: `${BASE}/payments/my`,
};

// --- Notification Service ---
// Spring Boot Service: notification-service (internal; exposed partially)
export const NOTIFICATION_ENDPOINTS = {
  MY_NOTIFICATIONS: `${BASE}/notifications/my`,
  MARK_READ: (id) => `${BASE}/notifications/${id}/read`,
};

// --- Admin / Customer endpoints (via order-service / identity-service) ---
export const ADMIN_ENDPOINTS = {
  CUSTOMERS: `${BASE}/admin/customers`,
  CUSTOMER_DETAIL: (id) => `${BASE}/admin/customers/${id}`,
  DASHBOARD_STATS: `${BASE}/admin/dashboard/stats`,
};
