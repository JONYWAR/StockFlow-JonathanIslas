import { z } from 'zod';

export const BranchValidation = z.object({
  name: z.string().min(1, 'Name is required'),
  location: z.string().min(1, 'Location is required'),
});

export type BranchValidationType = z.infer<typeof BranchValidation>;

