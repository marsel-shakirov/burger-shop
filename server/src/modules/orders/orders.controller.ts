import type { Request, Response } from 'express';

import { BadRequest } from '../../errors/bad-request.error.ts';
import { NotFound } from '../../errors/not-found.error.ts';
import { getUserId } from '../../lib/get-user-id.ts';
import { createOrderUseCase } from './create-order.use-case.ts';
import { listOrdersUseCase } from './list-orders.use-case.ts';
import { findOrderDetails } from './orders.repository.ts';
import {
  createOrderBodySchema,
  listOrdersQuerySchema,
  orderParamsSchema,
} from './orders.schema.ts';

export async function listOrders(req: Request, res: Response) {
  const userId = getUserId(req);
  const result = listOrdersQuerySchema.safeParse(req.query);
  if (!result.success) throw new BadRequest();

  res.json(await listOrdersUseCase(userId, result.data));
}

export async function getOrder(req: Request, res: Response) {
  const userId = getUserId(req);
  const result = orderParamsSchema.safeParse(req.params);
  if (!result.success) throw new BadRequest();

  const order = await findOrderDetails(userId, result.data.id);
  if (!order) throw new NotFound('Order not found', 'order_not_found');

  res.json(order);
}

export async function createOrder(req: Request, res: Response) {
  const userId = getUserId(req);
  const result = createOrderBodySchema.safeParse(req.body);
  if (!result.success) throw new BadRequest();

  const { order, created } = await createOrderUseCase(userId, result.data);
  res.status(created ? 201 : 200).json(order);
}
