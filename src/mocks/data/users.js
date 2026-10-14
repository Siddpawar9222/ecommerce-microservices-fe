// ============================================================
// Mock Users — maps to Identity Service user model
// Passwords are NEVER stored in real apps. Demo only.
// ============================================================

export const MOCK_CREDENTIALS = [
  {
    email: 'customer@demo.com',
    // In a real app this would be bcrypt-hashed on the backend
    passwordPlain: 'Customer@123',
    userId: 'usr-001',
  },
  {
    email: 'admin@demo.com',
    passwordPlain: 'Admin@123',
    userId: 'usr-002',
  },
  {
    email: 'inventory@demo.com',
    passwordPlain: 'Inventory@123',
    userId: 'usr-003',
  },
];

export const MOCK_USERS = [
  {
    id: 'usr-001',
    name: 'Alex Johnson',
    email: 'customer@demo.com',
    role: 'CUSTOMER',
    avatar: null,
    phone: '+1 (555) 234-5678',
    createdAt: '2024-01-15T10:30:00Z',
    address: {
      line1: '42 Maple Avenue',
      line2: 'Apt 3B',
      city: 'Austin',
      state: 'TX',
      zip: '78701',
      country: 'US',
    },
  },
  {
    id: 'usr-002',
    name: 'Sarah Chen',
    email: 'admin@demo.com',
    role: 'ADMIN',
    avatar: null,
    phone: '+1 (555) 987-6543',
    createdAt: '2023-06-01T09:00:00Z',
    address: null,
  },
  {
    id: 'usr-003',
    name: 'Marcus Lee',
    email: 'inventory@demo.com',
    role: 'INVENTORY_MANAGER',
    avatar: null,
    phone: '+1 (555) 456-7890',
    createdAt: '2023-08-20T08:00:00Z',
    address: null,
  },
  // Additional customers for admin customer list
  {
    id: 'usr-004',
    name: 'Emma Davis',
    email: 'emma.davis@example.com',
    role: 'CUSTOMER',
    avatar: null,
    phone: '+1 (555) 111-2222',
    createdAt: '2024-02-10T11:00:00Z',
    address: { line1: '88 Oak St', city: 'Denver', state: 'CO', zip: '80201', country: 'US' },
  },
  {
    id: 'usr-005',
    name: 'James Wilson',
    email: 'james.w@example.com',
    role: 'CUSTOMER',
    avatar: null,
    phone: '+1 (555) 333-4444',
    createdAt: '2024-03-05T14:00:00Z',
    address: { line1: '17 Pine Road', city: 'Seattle', state: 'WA', zip: '98101', country: 'US' },
  },
  {
    id: 'usr-006',
    name: 'Priya Sharma',
    email: 'priya.s@example.com',
    role: 'CUSTOMER',
    avatar: null,
    phone: '+1 (555) 555-6666',
    createdAt: '2024-04-12T16:00:00Z',
    address: { line1: '5 Birch Lane', city: 'Chicago', state: 'IL', zip: '60601', country: 'US' },
  },
];
