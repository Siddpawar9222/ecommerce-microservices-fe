import { describe, it, expect } from 'vitest';
import { mockOrderRepository } from '../../../mocks/repositories/mockOrderRepository';
import { mockPaymentRepository } from '../../../mocks/repositories/mockPaymentRepository';

describe('Checkout and Order Outcomes Workflow', () => {
  it('creates an order with calculated subtotal, shipping, and tax', async () => {
    const orderInput = {
      customerId: 'usr-001',
      customerName: 'Alex Johnson',
      customerEmail: 'customer@demo.com',
      items: [
        { productId: 'prod-001', name: 'Wireless Headphones', unitPrice: 50, quantity: 2 },
      ],
      shippingAddress: {
        fullName: 'Alex Johnson',
        addressLine1: '42 Maple Ave',
        city: 'Austin',
        state: 'TX',
        postalCode: '78701',
        country: 'US',
      },
      paymentMethod: 'CREDIT_CARD',
    };

    const created = await mockOrderRepository.createOrder(orderInput);

    expect(created.id).toBeDefined();
    expect(created.subtotal).toBe(100);
    expect(created.shippingCost).toBe(0); // Free shipping over $100
    expect(created.tax).toBe(9); // 9% tax
    expect(created.total).toBe(109);
    expect(created.status).toBe('PENDING');
  });

  it('simulates credit card payment outcome', async () => {
    try {
      const paymentResult = await mockPaymentRepository.initiatePayment({
        orderId: 'ord-test-1',
        amount: 109,
        method: 'CREDIT_CARD',
      });
      expect(paymentResult.status).toBe('SUCCESS');
      expect(paymentResult.id).toBeDefined();
    } catch (err) {
      expect(err.message).toBeDefined();
      expect([402, 408]).toContain(err.status);
    }
  });



  it('allows order cancellation when in PENDING or CONFIRMED status', async () => {
    const orderInput = {
      customerId: 'usr-001',
      customerName: 'Alex Johnson',
      customerEmail: 'customer@demo.com',
      items: [{ productId: 'prod-001', unitPrice: 20, quantity: 1 }],
      shippingAddress: {},
      paymentMethod: 'CASH_ON_DELIVERY',
    };

    const created = await mockOrderRepository.createOrder(orderInput);
    const cancelled = await mockOrderRepository.cancelOrder(created.id);

    expect(cancelled.status).toBe('CANCELLED');
  });
});
