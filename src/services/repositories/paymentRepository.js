// ============================================================
// HTTP Payment Repository — Spring Boot Payment Service (planned)
// ============================================================

import httpClient from '../api/httpClient';
import { PAYMENT_ENDPOINTS } from '../api/endpoints';

const initiatePayment = (data) =>
  httpClient.post(PAYMENT_ENDPOINTS.INITIATE, data);

const getPaymentStatus = (paymentId) =>
  httpClient.get(PAYMENT_ENDPOINTS.STATUS(paymentId));

const getMyPayments = () =>
  httpClient.get(PAYMENT_ENDPOINTS.MY_PAYMENTS);

export const httpPaymentRepository = {
  initiatePayment,
  getPaymentStatus,
  getMyPayments,
};
