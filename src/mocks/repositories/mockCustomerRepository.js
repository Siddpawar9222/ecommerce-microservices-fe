// ============================================================
// Mock Customer Repository
// ============================================================

import { MOCK_USERS } from '../data/users';
import { withDelay } from '../utils/mockHelpers';

const customers = [...MOCK_USERS.filter((u) => u.role === 'CUSTOMER')];

const getCustomers = async (params = {}) => {
  return withDelay(() => {
    const { search = '', page = 1, pageSize = 10 } = params;
    let filtered = [...customers];

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
      );
    }

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);

    return { items, total, page, pageSize };
  });
};

const getCustomerById = async (id) => {
  return withDelay(() => {
    const customer = customers.find((c) => c.id === id);
    if (!customer) throw { message: `Customer "${id}" not found.`, status: 404 };
    return customer;
  });
};

export const mockCustomerRepository = {
  getCustomers,
  getCustomerById,
};
