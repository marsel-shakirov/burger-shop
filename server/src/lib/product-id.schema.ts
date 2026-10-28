import { z } from 'zod';

export const productIdSchema = z.int32().positive();

export const productIdParamsSchema = z.object({
  productId: z.string().regex(/^\d+$/).transform(Number).pipe(productIdSchema),
});
