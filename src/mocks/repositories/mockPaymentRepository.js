// ============================================================
// Mock Payment Repository
// Simulates payment success/failure/timeout scenarios
// ============================================================

import { MOCK_PAYMENTS } from '../data/payments';
import { withDelay, generateId } from '../utils/mockHelpers';

let payments = [...MOCK_PAYMENTS];

/**
 * Initiate a payment for an order.
 * Simulates 85% success, 10% failure, 5% timeout.
 * @param {{ orderId, amount, method }} data
 */
const initiatePayment = async (data) => {
  // Longer delay for payment processing feel
  await new Promise((r) => setTimeout(r, 1800));

  const roll = Math.random();
  const paymentId = generateId('pay');
  const transactionRef = `TXN-${Math.floor(Math.random() * 9000 + 1000)}-${generateId('').slice(0, 4).toUpperCase()}`;

  if (roll < 0.85) {
    // Success
    const payment = {
      id: paymentId,
      orderId: data.orderId,
      customerId: data.customerId,
      method: data.method,
      status: 'SUCCESS',
      amount: data.amount,
      currency: 'USD',
      transactionRef,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };
    payments = [payment, ...payments];
    return payment;
  } else if (roll < 0.95) {
    // Failure
    const payment = {
      id: paymentId,
      orderId: data.orderId,
      customerId: data.customerId,
      method: data.method,
      status: 'FAILED',
      amount: data.amount,
      currency: 'USD',
      transactionRef: null,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };
    payments = [payment, ...payments];
    throw { message: 'Payment was declined by your bank. Please try a different payment method.', paymentId, status: 402 };
  } else {
    // Timeout
    throw { message: 'Payment gateway timed out. Your card was not charged. Please try again.', status: 408 };
  }
};

/**
 * Get payment status by payment ID.
 * @param {string} paymentId
 */
const getPaymentStatus = async (paymentId) => {
  return withDelay(() => {
    const payment = payments.find((p) => p.id === paymentId);
    if (!payment) throw { message: `Payment "${paymentId}" not found.`, status: 404 };
    return payment;
  });
};

/**
 * Get payments for the current user.
 * @param {string} customerId
 */
const getMyPayments = async (customerId) => {
  return withDelay(() => {
    return payments.filter((p) => p.customerId === customerId);
  });
};

export const mockPaymentRepository = {
  initiatePayment,
  getPaymentStatus,
  getMyPayments,
};
