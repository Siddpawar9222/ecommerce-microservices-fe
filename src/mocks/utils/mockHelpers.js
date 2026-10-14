// ============================================================
// Mock utility: simulate async network delay
// ============================================================
import { API_CONFIG } from '../../services/api/config';

export const mockDelay = (ms = API_CONFIG.MOCK_DELAY_MS) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Wraps a mock operation with a simulated delay.
 * @param {Function} fn - async function returning data
 */
export const withDelay = async (fn) => {
  await mockDelay();
  return fn();
};

/**
 * Generate a simple unique ID for newly created mock entities.
 * Not cryptographically secure — demo only.
 */
export const generateId = (prefix = 'id') =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
