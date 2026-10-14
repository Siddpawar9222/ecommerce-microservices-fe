// ============================================================
// Mock Inventory — maps to Inventory Service model
// Consistent with product IDs. Tracks available/reserved/total.
// ============================================================

export const MOCK_INVENTORY = [
  { productId: 'prod-001', productName: 'ProSound Wireless Headphones', totalStock: 150, reservedStock: 12, availableStock: 138, lowStockThreshold: 20, lastUpdated: '2024-10-10T08:00:00Z' },
  { productId: 'prod-002', productName: 'UltraView 4K Monitor 27"', totalStock: 60, reservedStock: 5, availableStock: 55, lowStockThreshold: 10, lastUpdated: '2024-10-10T08:00:00Z' },
  { productId: 'prod-003', productName: 'SwiftCharge 65W USB-C Hub', totalStock: 300, reservedStock: 45, availableStock: 255, lowStockThreshold: 30, lastUpdated: '2024-10-10T08:00:00Z' },
  { productId: 'prod-004', productName: 'KeyMaster Mechanical Keyboard', totalStock: 18, reservedStock: 3, availableStock: 15, lowStockThreshold: 20, lastUpdated: '2024-10-11T08:00:00Z' },
  { productId: 'prod-005', productName: 'SmartCapture Pro Camera', totalStock: 25, reservedStock: 2, availableStock: 23, lowStockThreshold: 10, lastUpdated: '2024-10-09T08:00:00Z' },
  { productId: 'prod-006', productName: 'Urban Comfort Hoodie', totalStock: 500, reservedStock: 78, availableStock: 422, lowStockThreshold: 50, lastUpdated: '2024-10-10T08:00:00Z' },
  { productId: 'prod-007', productName: 'RunPro Athletic Shorts', totalStock: 8, reservedStock: 3, availableStock: 5, lowStockThreshold: 20, lastUpdated: '2024-10-12T08:00:00Z' },
  { productId: 'prod-008', productName: 'Classic Oxford Shirt', totalStock: 200, reservedStock: 15, availableStock: 185, lowStockThreshold: 30, lastUpdated: '2024-10-10T08:00:00Z' },
  { productId: 'prod-009', productName: 'Clean Architecture', totalStock: 120, reservedStock: 8, availableStock: 112, lowStockThreshold: 15, lastUpdated: '2024-10-08T08:00:00Z' },
  { productId: 'prod-010', productName: 'Designing Data-Intensive Applications', totalStock: 90, reservedStock: 6, availableStock: 84, lowStockThreshold: 15, lastUpdated: '2024-10-08T08:00:00Z' },
  { productId: 'prod-011', productName: 'BrewMaster Pour-Over Set', totalStock: 12, reservedStock: 4, availableStock: 8, lowStockThreshold: 15, lastUpdated: '2024-10-11T08:00:00Z' },
  { productId: 'prod-012', productName: 'AirPurify HEPA Filter', totalStock: 75, reservedStock: 10, availableStock: 65, lowStockThreshold: 10, lastUpdated: '2024-10-10T08:00:00Z' },
  { productId: 'prod-013', productName: 'TrailBlaze Hiking Backpack 50L', totalStock: 45, reservedStock: 5, availableStock: 40, lowStockThreshold: 10, lastUpdated: '2024-10-10T08:00:00Z' },
  { productId: 'prod-014', productName: 'CoreFlex Yoga Mat', totalStock: 200, reservedStock: 22, availableStock: 178, lowStockThreshold: 25, lastUpdated: '2024-10-10T08:00:00Z' },
  { productId: 'prod-015', productName: 'GlowElixir Vitamin C Serum', totalStock: 6, reservedStock: 1, availableStock: 5, lowStockThreshold: 20, lastUpdated: '2024-10-13T08:00:00Z' },
];

// Reservation records (linked to orders)
export const MOCK_RESERVATIONS = [
  { id: 'res-001', productId: 'prod-001', productName: 'ProSound Wireless Headphones', orderId: 'ord-001', quantity: 2, status: 'RESERVED', reservedAt: '2024-10-08T14:22:00Z' },
  { id: 'res-002', productId: 'prod-004', productName: 'KeyMaster Mechanical Keyboard', orderId: 'ord-001', quantity: 1, status: 'RESERVED', reservedAt: '2024-10-08T14:22:00Z' },
  { id: 'res-003', productId: 'prod-006', productName: 'Urban Comfort Hoodie', orderId: 'ord-002', quantity: 3, status: 'FULFILLED', reservedAt: '2024-09-25T10:00:00Z' },
  { id: 'res-004', productId: 'prod-007', productName: 'RunPro Athletic Shorts', orderId: 'ord-003', quantity: 2, status: 'RESERVED', reservedAt: '2024-10-12T09:15:00Z' },
  { id: 'res-005', productId: 'prod-011', productName: 'BrewMaster Pour-Over Set', orderId: 'ord-004', quantity: 1, status: 'RESERVED', reservedAt: '2024-10-11T16:30:00Z' },
  { id: 'res-006', productId: 'prod-015', productName: 'GlowElixir Vitamin C Serum', orderId: 'ord-005', quantity: 1, status: 'RESERVED', reservedAt: '2024-10-13T11:00:00Z' },
];
