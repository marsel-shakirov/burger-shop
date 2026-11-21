import type { Request, Response } from 'express';

import { BadRequest } from '../../errors/bad-request.error.ts';
import { getUserId } from '../../lib/get-user-id.ts';
import { createOrderUseCase } from './create-order.use-case.ts';
import { createOrderBodySchema } from './orders.schema.ts';

export async function createOrder(req: Request, res: Response) {
  const userId = getUserId(req);
  const result = createOrderBodySchema.safeParse(req.body);
  if (!result.success) throw new BadRequest();

  const { order, created } = await createOrderUseCase(userId, result.data);
  res.status(created ? 201 : 200).json(order);
}
