import { z } from 'zod';

import { FAVORITES_MERGE_LIMIT } from './favorites.constants.ts';

const productIdSchema = z.int32().positive();

export const favoriteParamsSchema = z.object({
  productId: z.string().regex(/^\d+$/).transform(Number).pipe(productIdSchema),
});

export const mergeFavoritesBodySchema = z.strictObject({
  productIds: z.array(productIdSchema).max(FAVORITES_MERGE_LIMIT),
});
