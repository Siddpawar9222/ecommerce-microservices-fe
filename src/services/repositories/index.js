// ============================================================
// Repository Factory — selects mock vs HTTP implementations
// Change VITE_USE_MOCK in .env to switch globally.
// ============================================================

import { isMockMode } from '../api/config';

// Mock implementations
import { mockAuthRepository } from '../../mocks/repositories/mockAuthRepository';
import { mockProductRepository } from '../../mocks/repositories/mockProductRepository';
import { mockOrderRepository } from '../../mocks/repositories/mockOrderRepository';
import { mockInventoryRepository } from '../../mocks/repositories/mockInventoryRepository';
import { mockPaymentRepository } from '../../mocks/repositories/mockPaymentRepository';

import { mockCustomerRepository } from '../../mocks/repositories/mockCustomerRepository';

// HTTP implementations
import { httpAuthRepository } from './authRepository';
import { httpProductRepository } from './productRepository';
import { httpOrderRepository } from './orderRepository';
import { httpInventoryRepository } from './inventoryRepository';
import { httpPaymentRepository } from './paymentRepository';
import { httpCustomerRepository } from './customerRepository';

const useMock = isMockMode();

export const authRepository = useMock ? mockAuthRepository : httpAuthRepository;
export const productRepository = useMock ? mockProductRepository : httpProductRepository;
export const orderRepository = useMock ? mockOrderRepository : httpOrderRepository;
export const inventoryRepository = useMock ? mockInventoryRepository : httpInventoryRepository;
export const paymentRepository = useMock ? mockPaymentRepository : httpPaymentRepository;
export const customerRepository = useMock ? mockCustomerRepository : httpCustomerRepository;

