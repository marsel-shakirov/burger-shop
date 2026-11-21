import { z } from 'zod';

import { productIdSchema } from '../../lib/product-id.schema.ts';
import { CART_MAX_QUANTITY } from '../cart/cart.constants.ts';

export const createOrderBodySchema = z.strictObject({
  idempotencyKey: z.uuid(),
  customerName: z.string().trim().min(1).max(100),
  customerPhone: z
    .string()
    .transform((value) => value.replace(/[\s()-]/g, ''))
    .pipe(z.string().regex(/^\+?\d{10,15}$/)),
  customerComment: z.string().trim().max(500).optional(),
  items: z
    .array(
      z.strictObject({
        productId: productIdSchema,
        quantity: z.int().min(1).max(CART_MAX_QUANTITY),
        unitPrice: z.int32().nonnegative(),
      }),
    )
    .min(1)
    .refine((items) => new Set(items.map((item) => item.productId)).size === items.length),
});

export type CreateOrderInput = z.infer<typeof createOrderBodySchema>;
