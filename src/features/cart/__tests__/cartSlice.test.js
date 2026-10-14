import { describe, it, expect, beforeEach } from 'vitest';
import cartReducer, {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  selectCartCount,
  selectCartSubtotal,
  selectCartTotal,
} from '../cartSlice';

describe('cartSlice reducer & selectors', () => {
  const initialTestState = { items: [] };

  const sampleProduct = {
    id: 'prod-001',
    name: 'Wireless Headphones',
    price: 100,
    images: ['https://example.com/image.jpg'],
  };

  it('should handle initial state', () => {
    expect(cartReducer(undefined, { type: 'unknown' }).items).toEqual([]);
  });

  it('should add a product to an empty cart', () => {
    const nextState = cartReducer(initialTestState, addToCart({ product: sampleProduct, quantity: 2 }));
    expect(nextState.items).toHaveLength(1);
    expect(nextState.items[0]).toEqual({
      productId: 'prod-001',
      name: 'Wireless Headphones',
      price: 100,
      image: 'https://example.com/image.jpg',
      quantity: 2,
    });
  });

  it('should increment quantity when same product is added again', () => {
    const stateWithOne = {
      items: [{ productId: 'prod-001', name: 'Wireless Headphones', price: 100, image: null, quantity: 2 }],
    };
    const nextState = cartReducer(stateWithOne, addToCart({ product: sampleProduct, quantity: 3 }));
    expect(nextState.items).toHaveLength(1);
    expect(nextState.items[0].quantity).toBe(5);
  });

  it('should update quantity of an existing product', () => {
    const state = {
      items: [{ productId: 'prod-001', name: 'Wireless Headphones', price: 100, image: null, quantity: 2 }],
    };
    const nextState = cartReducer(state, updateQuantity({ productId: 'prod-001', quantity: 6 }));
    expect(nextState.items[0].quantity).toBe(6);
  });

  it('should remove item if quantity updated to 0', () => {
    const state = {
      items: [{ productId: 'prod-001', name: 'Wireless Headphones', price: 100, image: null, quantity: 2 }],
    };
    const nextState = cartReducer(state, updateQuantity({ productId: 'prod-001', quantity: 0 }));
    expect(nextState.items).toHaveLength(0);
  });

  it('should remove item with removeFromCart', () => {
    const state = {
      items: [
        { productId: 'prod-001', name: 'Product 1', price: 50, image: null, quantity: 1 },
        { productId: 'prod-002', name: 'Product 2', price: 75, image: null, quantity: 2 },
      ],
    };
    const nextState = cartReducer(state, removeFromCart('prod-001'));
    expect(nextState.items).toHaveLength(1);
    expect(nextState.items[0].productId).toBe('prod-002');
  });

  it('should clear cart', () => {
    const state = {
      items: [{ productId: 'prod-001', name: 'Product 1', price: 50, image: null, quantity: 1 }],
    };
    const nextState = cartReducer(state, clearCart());
    expect(nextState.items).toHaveLength(0);
  });

  it('should correctly calculate count, subtotal, shipping and total', () => {
    const rootState = {
      cart: {
        items: [
          { productId: 'prod-001', price: 40, quantity: 2 },
          { productId: 'prod-002', price: 20, quantity: 1 },
        ],
      },
    };

    expect(selectCartCount(rootState)).toBe(3);
    expect(selectCartSubtotal(rootState)).toBe(100);

    const totals = selectCartTotal(rootState);
    expect(totals.subtotal).toBe(100);
    expect(totals.shipping).toBe(0); // free shipping over $100
    expect(totals.tax).toBe(9); // 9% of 100
    expect(totals.total).toBe(109);
  });
});
