import { z } from 'zod';

export const StockValidation = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  branchId: z.string().min(1, 'Branch ID is required'),
  quantity: z.number().min(0, 'Quantity must be at least 0'),
});

export type StockValidationType = z.infer<typeof StockValidation>;

