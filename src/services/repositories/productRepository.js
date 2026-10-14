// ============================================================
// HTTP Product Repository — Spring Boot Product Service
// ============================================================

import httpClient from '../api/httpClient';
import { PRODUCT_ENDPOINTS } from '../api/endpoints';

const getProducts = (params) =>
  httpClient.get(PRODUCT_ENDPOINTS.LIST, { params });

const getProductById = (id) =>
  httpClient.get(PRODUCT_ENDPOINTS.DETAIL(id));

const searchProducts = (query) =>
  httpClient.get(PRODUCT_ENDPOINTS.SEARCH, { params: { q: query } });

const getFeaturedProducts = () =>
  httpClient.get(PRODUCT_ENDPOINTS.FEATURED);

const createProduct = (data) =>
  httpClient.post(PRODUCT_ENDPOINTS.CREATE, data);

const updateProduct = (id, data) =>
  httpClient.put(PRODUCT_ENDPOINTS.UPDATE(id), data);

const toggleProductStatus = (id) =>
  httpClient.patch(PRODUCT_ENDPOINTS.UPDATE(id), { toggle: true });

const deleteProduct = (id) =>
  httpClient.delete(PRODUCT_ENDPOINTS.DELETE(id));

export const httpProductRepository = {
  getProducts,
  getProductById,
  searchProducts,
  getFeaturedProducts,
  createProduct,
  updateProduct,
  toggleProductStatus,
  deleteProduct,
};
