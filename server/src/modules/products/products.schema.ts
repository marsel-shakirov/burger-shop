import { z } from 'zod';

export const getProductsQuerySchema = z.object({
  category: z.string().optional(),
  sort: z.enum(['popularity', 'price', 'rating']).default('popularity'),
  order: z.enum(['asc', 'desc']).default('asc'),
});

export type GetProductQuery = z.infer<typeof getProductsQuerySchema>;
