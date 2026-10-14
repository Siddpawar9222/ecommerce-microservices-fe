// ============================================================
// Mock Product Repository
// In-memory mutable store so admin edits persist during session
// ============================================================

import { MOCK_PRODUCTS } from '../data/products';
import { withDelay, generateId } from '../utils/mockHelpers';

// Mutable in-memory store (session-scoped, resets on page refresh)
let products = [...MOCK_PRODUCTS];

/**
 * Get paginated, filtered, sorted products.
 * @param {{ page, pageSize, category, search, sortBy, sortDir, activeOnly }} params
 * @returns {{ items, total, page, pageSize }}
 */
const getProducts = async (params = {}) => {
  return withDelay(() => {
    const {
      page = 1,
      pageSize = 12,
      category = '',
      search = '',
      sortBy = 'createdAt',
      sortDir = 'desc',
      activeOnly = true,
    } = params;

    let filtered = [...products];

    if (activeOnly) {
      filtered = filtered.filter((p) => p.isActive);
    }

    if (category) {
      filtered = filtered.filter((p) => p.category === category);
    }

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      return sortDir === 'asc' ? (aVal > bVal ? 1 : -1) : aVal < bVal ? 1 : -1;
    });

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);

    return { items, total, page, pageSize };
  });
};

/**
 * Get a single product by ID.
 * @param {string} id
 */
const getProductById = async (id) => {
  return withDelay(() => {
    const product = products.find((p) => p.id === id);
    if (!product) throw { message: `Product with ID "${id}" not found.`, status: 404 };
    return product;
  });
};

/**
 * Search products by keyword (name, brand, tags).
 * @param {string} query
 */
const searchProducts = async (query) => {
  return getProducts({ search: query, activeOnly: true, pageSize: 50 });
};

/**
 * Get featured products for the storefront.
 */
const getFeaturedProducts = async () => {
  return withDelay(() => {
    return products.filter((p) => p.isFeatured && p.isActive);
  });
};

/**
 * Create a new product (admin).
 * @param {object} data
 */
const createProduct = async (data) => {
  return withDelay(() => {
    const newProduct = {
      id: generateId('prod'),
      ...data,
      isActive: true,
      isFeatured: false,
      rating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    products = [newProduct, ...products];
    return newProduct;
  });
};

/**
 * Update an existing product (admin).
 * @param {string} id
 * @param {object} data
 */
const updateProduct = async (id, data) => {
  return withDelay(() => {
    const idx = products.findIndex((p) => p.id === id);
    if (idx === -1) throw { message: `Product "${id}" not found.`, status: 404 };
    products[idx] = { ...products[idx], ...data, updatedAt: new Date().toISOString() };
    return products[idx];
  });
};

/**
 * Toggle product active/inactive (admin).
 * @param {string} id
 */
const toggleProductStatus = async (id) => {
  return withDelay(() => {
    const idx = products.findIndex((p) => p.id === id);
    if (idx === -1) throw { message: `Product "${id}" not found.`, status: 404 };
    products[idx].isActive = !products[idx].isActive;
    products[idx].updatedAt = new Date().toISOString();
    return products[idx];
  });
};

/**
 * Delete a product (admin).
 * @param {string} id
 */
const deleteProduct = async (id) => {
  return withDelay(() => {
    const idx = products.findIndex((p) => p.id === id);
    if (idx === -1) throw { message: `Product "${id}" not found.`, status: 404 };
    products.splice(idx, 1);
    return { success: true };
  });
};

export const mockProductRepository = {
  getProducts,
  getProductById,
  searchProducts,
  getFeaturedProducts,
  createProduct,
  updateProduct,
  toggleProductStatus,
  deleteProduct,
};
