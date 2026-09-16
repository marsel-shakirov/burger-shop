import { z } from 'zod';

const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const getProductsQuerySchema = z.object({
  menu: slugSchema.optional(),
  category: slugSchema.optional(),
  sort: z.enum(['popularity', 'price', 'rating']).default('rating'),
  order: z.enum(['asc', 'desc']).default('desc'),
});

export type GetProductQuery = z.infer<typeof getProductsQuerySchema>;
