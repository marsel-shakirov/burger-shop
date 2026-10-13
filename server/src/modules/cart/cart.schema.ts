import { z } from 'zod';

import { CART_MAX_QUANTITY, CART_MERGE_LIMIT } from './cart.constants.ts';

const productIdSchema = z.int32().positive();

const quantitySchema = z.int().min(1).max(CART_MAX_QUANTITY);

export const cartItemParamsSchema = z.object({
  productId: z.string().regex(/^\d+$/).transform(Number).pipe(productIdSchema),
});

export const updateCartItemBodySchema = z.strictObject({
  quantity: quantitySchema,
});

export const mergeCartBodySchema = z.strictObject({
  items: z
    .array(z.strictObject({ productId: productIdSchema, quantity: quantitySchema }))
    .max(CART_MERGE_LIMIT),
});
