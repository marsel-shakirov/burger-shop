import type { Request, Response } from 'express';

import { BadRequest } from '../../errors/bad-request.error.ts';
import { getUserId } from '../../lib/get-user-id.ts';
import { productIdParamsSchema } from '../../lib/product-id.schema.ts';
import { mergeCartBodySchema, updateCartItemBodySchema } from './cart.schema.ts';
import { clearCartUseCase } from './clear-cart.use-case.ts';
import { getCartUseCase } from './get-cart.use-case.ts';
import { mergeCartUseCase } from './merge-cart.use-case.ts';
import { removeCartItemUseCase } from './remove-cart-item.use-case.ts';
import { updateCartItemUseCase } from './update-cart-item.use-case.ts';

export async function getCart(req: Request, res: Response) {
  res.json(await getCartUseCase(getUserId(req)));
}

export async function updateCartItem(req: Request, res: Response) {
  const userId = getUserId(req);
  const params = productIdParamsSchema.safeParse(req.params);
  const body = updateCartItemBodySchema.safeParse(req.body);

  if (!params.success || !body.success) {
    throw new BadRequest();
  }

  await updateCartItemUseCase(userId, params.data.productId, body.data.quantity);

  res.status(204).end();
}

export async function removeCartItem(req: Request, res: Response) {
  const userId = getUserId(req);
  const result = productIdParamsSchema.safeParse(req.params);

  if (!result.success) {
    throw new BadRequest();
  }

  await removeCartItemUseCase(userId, result.data.productId);

  res.status(204).end();
}

export async function clearCart(req: Request, res: Response) {
  await clearCartUseCase(getUserId(req));

  res.status(204).end();
}

export async function mergeCart(req: Request, res: Response) {
  const userId = getUserId(req);
  const result = mergeCartBodySchema.safeParse(req.body);

  if (!result.success) {
    throw new BadRequest();
  }

  res.json(await mergeCartUseCase(userId, result.data.items));
}
