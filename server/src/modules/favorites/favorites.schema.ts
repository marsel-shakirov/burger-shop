import { z } from 'zod';

import { productIdSchema } from '../../lib/product-id.schema.ts';
import { FAVORITES_MERGE_LIMIT } from './favorites.constants.ts';

export const mergeFavoritesBodySchema = z.strictObject({
  productIds: z.array(productIdSchema).max(FAVORITES_MERGE_LIMIT),
});
