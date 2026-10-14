// ============================================================
// HTTP Order Repository — Spring Boot Order Service
// ============================================================

import httpClient from '../api/httpClient';
import { ORDER_ENDPOINTS } from '../api/endpoints';

const getOrders = (params) =>
  httpClient.get(ORDER_ENDPOINTS.LIST, { params });

const getMyOrders = () =>
  httpClient.get(ORDER_ENDPOINTS.MY_ORDERS);

const getOrderById = (id) =>
  httpClient.get(ORDER_ENDPOINTS.DETAIL(id));

const createOrder = (data) =>
  httpClient.post(ORDER_ENDPOINTS.CREATE, data);

const cancelOrder = (id) =>
  httpClient.post(ORDER_ENDPOINTS.CANCEL(id));

const updateOrderStatus = (id, status) =>
  httpClient.patch(ORDER_ENDPOINTS.STATUS(id), { status });

export const httpOrderRepository = {
  getOrders,
  getMyOrders,
  getOrderById,
  createOrder,
  cancelOrder,
  updateOrderStatus,
};
