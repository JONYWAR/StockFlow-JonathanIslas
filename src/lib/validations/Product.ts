import { z } from 'zod';

export const ProductValidationSchema = z.object({
  sku: z.string().min(1, 'SKU is required'),
  name: z.string().min(1, 'Name is required'),
  price: z.number().positive('Price must be a positive number'),
  category: z.string().min(1, 'Category is required'),
});

export type ProductValidationType = z.infer<typeof ProductValidationSchema>;
