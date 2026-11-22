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

const orderCursorSchema = z.strictObject({
  createdAt: z.iso.datetime({ precision: 6 }).refine((value) => !value.startsWith('0000-')),
  id: z.uuid(),
});

export type OrderCursor = z.infer<typeof orderCursorSchema>;

export const listOrdersQuerySchema = z.strictObject({
  limit: z
    .string()
    .regex(/^[1-9]\d?$/)
    .transform(Number)
    .pipe(z.int().max(50))
    .default(20),
  cursor: z
    .string()
    .min(1)
    .max(256)
    .pipe(z.base64url())
    .transform((value, ctx): unknown => {
      try {
        return JSON.parse(Buffer.from(value, 'base64url').toString('utf8'));
      } catch {
        ctx.addIssue({ code: 'custom', message: 'Invalid order cursor' });
        return z.NEVER;
      }
    })
    .pipe(orderCursorSchema)
    .optional(),
});

export const orderParamsSchema = z.strictObject({ id: z.uuid() });

export type ListOrdersQuery = z.infer<typeof listOrdersQuerySchema>;
