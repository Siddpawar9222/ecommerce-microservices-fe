// ============================================================
// Mock Inventory Repository
// ============================================================

import { MOCK_INVENTORY, MOCK_RESERVATIONS } from '../data/inventory';
import { withDelay } from '../utils/mockHelpers';

let inventory = [...MOCK_INVENTORY];
const LOW_STOCK_MULTIPLIER = 1; // items where available <= threshold

/**
 * Get all inventory items (with optional search).
 * @param {{ search, page, pageSize }} params
 */
const getInventory = async (params = {}) => {
  return withDelay(() => {
    const { search = '', page = 1, pageSize = 20 } = params;
    let filtered = [...inventory];

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter((i) => i.productName.toLowerCase().includes(q));
    }

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);
    return { items, total, page, pageSize };
  });
};

/**
 * Get inventory for a single product.
 * @param {string} productId
 */
const getInventoryByProductId = async (productId) => {
  return withDelay(() => {
    const item = inventory.find((i) => i.productId === productId);
    if (!item) throw { message: `No inventory record for product "${productId}".`, status: 404 };
    return item;
  });
};

/**
 * Get products where availableStock <= lowStockThreshold.
 */
const getLowStockProducts = async () => {
  return withDelay(() => {
    return inventory.filter(
      (i) => i.availableStock <= i.lowStockThreshold * LOW_STOCK_MULTIPLIER
    );
  });
};

/**
 * Adjust stock for a product.
 * @param {string} productId
 * @param {{ delta, reason }} data  — delta can be positive (restock) or negative (shrinkage)
 */
const updateStock = async (productId, data) => {
  return withDelay(() => {
    const idx = inventory.findIndex((i) => i.productId === productId);
    if (idx === -1) throw { message: `Inventory for "${productId}" not found.`, status: 404 };

    const { delta } = data;
    const current = inventory[idx];
    const newTotal = current.totalStock + delta;
    const newAvailable = current.availableStock + delta;

    if (newTotal < 0 || newAvailable < 0) {
      throw { message: 'Stock cannot be reduced below zero.', status: 400 };
    }

    inventory[idx] = {
      ...current,
      totalStock: newTotal,
      availableStock: newAvailable,
      lastUpdated: new Date().toISOString(),
    };
    return inventory[idx];
  });
};

/**
 * Get reservation records (linked to orders).
 */
const getReservations = async (params = {}) => {
  return withDelay(() => {
    const { search = '' } = params;
    let filtered = [...MOCK_RESERVATIONS];
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (r) => r.productName.toLowerCase().includes(q) || r.orderId.toLowerCase().includes(q)
      );
    }
    return filtered;
  });
};

export const mockInventoryRepository = {
  getInventory,
  getInventoryByProductId,
  getLowStockProducts,
  updateStock,
  getReservations,
};
