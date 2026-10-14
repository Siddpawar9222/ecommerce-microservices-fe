// ============================================================
// HTTP Inventory Repository — Spring Boot Inventory Service
// ============================================================

import httpClient from '../api/httpClient';
import { INVENTORY_ENDPOINTS } from '../api/endpoints';

const getInventory = (params) =>
  httpClient.get(INVENTORY_ENDPOINTS.LIST, { params });

const getInventoryByProductId = (productId) =>
  httpClient.get(INVENTORY_ENDPOINTS.DETAIL(productId));

const getLowStockProducts = () =>
  httpClient.get(INVENTORY_ENDPOINTS.LOW_STOCK);

const updateStock = (productId, data) =>
  httpClient.patch(INVENTORY_ENDPOINTS.UPDATE_STOCK(productId), data);

const getReservations = (params) =>
  httpClient.get(INVENTORY_ENDPOINTS.RESERVATIONS, { params });

export const httpInventoryRepository = {
  getInventory,
  getInventoryByProductId,
  getLowStockProducts,
  updateStock,
  getReservations,
};
