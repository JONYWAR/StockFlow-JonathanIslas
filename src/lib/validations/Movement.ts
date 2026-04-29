import { z } from 'zod';

export const MovementValidation = z.object({
  movementType: z.enum(['entry', 'out', 'transfer'],
      {error: () => ({ message: 'Movement type must be one of: entry, out, transfer' })}),
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().positive('Quantity must be greater than 0'),
  originBranch: z.string().min(1, 'Origin branch is required'),
  destinationBranch: z.string().min(1, 'Destination branch is required').optional(),
  reason: z.string().optional(),
});

export type MovementValidationType = z.infer<typeof MovementValidation>;

