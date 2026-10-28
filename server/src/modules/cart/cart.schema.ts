import { z } from 'zod';

import { productIdSchema } from '../../lib/product-id.schema.ts';
import { CART_MAX_QUANTITY, CART_MERGE_LIMIT } from './cart.constants.ts';

const quantitySchema = z.int().min(1).max(CART_MAX_QUANTITY);

export const updateCartItemBodySchema = z.strictObject({
  quantity: quantitySchema,
});

export const mergeCartBodySchema = z.strictObject({
  items: z
    .array(z.strictObject({ productId: productIdSchema, quantity: quantitySchema }))
    .max(CART_MERGE_LIMIT),
});
