import { z } from 'zod';

export const getProductsQuerySchema = z.object({
  category: z.enum(['beef', 'chicken', 'fish']).optional(),
  sort: z.enum(['popularity', 'price', 'rating']).default('popularity'),
  order: z.enum(['asc', 'desc']).default('asc'),
});

export type GetProductQuery = z.infer<typeof getProductsQuerySchema>;
