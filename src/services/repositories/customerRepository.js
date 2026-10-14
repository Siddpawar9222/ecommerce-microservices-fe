// ============================================================
// HTTP Customer Repository — Spring Boot Identity Service / Admin
// ============================================================

import httpClient from '../api/httpClient';
import { ADMIN_ENDPOINTS } from '../api/endpoints';

const getCustomers = async (params = {}) => {
  return httpClient.get(ADMIN_ENDPOINTS.CUSTOMERS, { params });
};

const getCustomerById = async (id) => {
  return httpClient.get(ADMIN_ENDPOINTS.CUSTOMER_DETAIL(id));
};

export const httpCustomerRepository = {
  getCustomers,
  getCustomerById,
};
