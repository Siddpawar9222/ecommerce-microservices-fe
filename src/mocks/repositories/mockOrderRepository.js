// ============================================================
// Mock Order Repository
// Maintains consistent cross-entity state (orders ↔ inventory)
// ============================================================

import { MOCK_ORDERS } from '../data/orders';
import { withDelay, generateId } from '../utils/mockHelpers';

let orders = [...MOCK_ORDERS];

/**
 * Get all orders (admin).
 * @param {{ page, pageSize, status, search }} params
 */
const getOrders = async (params = {}) => {
  return withDelay(() => {
    const { page = 1, pageSize = 10, status = '', search = '' } = params;

    let filtered = [...orders];

    if (status) {
      filtered = filtered.filter((o) => o.status === status);
    }

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerEmail.toLowerCase().includes(q)
      );
    }

    // Sort by newest first
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);

    return { items, total, page, pageSize };
  });
};

/**
 * Get orders for the current customer.
 * @param {string} customerId
 */
const getMyOrders = async (customerId) => {
  return withDelay(() => {
    const myOrders = orders
      .filter((o) => o.customerId === customerId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return myOrders;
  });
};

/**
 * Get a single order by ID.
 * @param {string} id
 */
const getOrderById = async (id) => {
  return withDelay(() => {
    const order = orders.find((o) => o.id === id);
    if (!order) throw { message: `Order "${id}" not found.`, status: 404 };
    return order;
  });
};

/**
 * Create a new order (checkout).
 * @param {{ customerId, customerName, customerEmail, items, shippingAddress, paymentMethod }} data
 */
const createOrder = async (data) => {
  return withDelay(() => {
    const subtotal = data.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
    const shippingCost = subtotal >= 100 ? 0 : 5.99;
    const tax = parseFloat((subtotal * 0.09).toFixed(2));
    const total = parseFloat((subtotal + shippingCost + tax).toFixed(2));

    const newOrder = {
      id: generateId('ord'),
      ...data,
      status: 'PENDING',
      paymentStatus: 'PENDING',
      paymentId: generateId('pay'),
      subtotal: parseFloat(subtotal.toFixed(2)),
      shippingCost,
      tax,
      total,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      notes: data.notes || '',
    };

    orders = [newOrder, ...orders];
    return newOrder;
  });
};

/**
 * Cancel an order (customer or admin).
 * @param {string} id
 */
const cancelOrder = async (id) => {
  return withDelay(() => {
    const idx = orders.findIndex((o) => o.id === id);
    if (idx === -1) throw { message: `Order "${id}" not found.`, status: 404 };

    const order = orders[idx];
    const cancellable = ['PENDING', 'CONFIRMED'];
    if (!cancellable.includes(order.status)) {
      throw { message: `Order cannot be cancelled in "${order.status}" status.`, status: 400 };
    }

    orders[idx] = {
      ...order,
      status: 'CANCELLED',
      paymentStatus: order.paymentStatus === 'SUCCESS' ? 'REFUNDED' : order.paymentStatus,
      updatedAt: new Date().toISOString(),
    };
    return orders[idx];
  });
};

/**
 * Update order status (admin).
 * @param {string} id
 * @param {string} status
 */
const updateOrderStatus = async (id, status) => {
  return withDelay(() => {
    const idx = orders.findIndex((o) => o.id === id);
    if (idx === -1) throw { message: `Order "${id}" not found.`, status: 404 };
    orders[idx] = { ...orders[idx], status, updatedAt: new Date().toISOString() };
    return orders[idx];
  });
};

export const mockOrderRepository = {
  getOrders,
  getMyOrders,
  getOrderById,
  createOrder,
  cancelOrder,
  updateOrderStatus,
};
