import { z } from 'zod';

export const checkoutSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  phone: z.string().min(10, 'Valid phone number required').max(20),
  address: z.string().min(5, 'Street address is required').max(200),
  city: z.string().min(2, 'City is required').max(100),
  state: z.string().min(2, 'State is required').max(100),
  zip: z.string().min(3, 'ZIP code is required').max(10),
  country: z.string().min(2, 'Country is required'),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  notes: z.string().max(500).optional(),
});

export const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters').max(200),
  category: z.string().min(1, 'Category is required'),
  brand: z.string().min(1, 'Brand is required').max(100),
  price: z.coerce.number().positive('Price must be positive').max(99999),
  originalPrice: z.coerce.number().positive().max(99999).optional(),
  description: z.string().min(20, 'Description must be at least 20 characters').max(2000),
  shortDescription: z.string().min(10, 'Short description required').max(200),
  images: z.string().min(1, 'At least one image URL is required'),
});

export const stockAdjustmentSchema = z.object({
  delta: z.coerce
    .number()
    .int('Must be a whole number')
    .refine((v) => v !== 0, 'Adjustment cannot be zero'),
  reason: z.string().min(3, 'Reason is required').max(200),
});
