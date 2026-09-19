import type { Request, Response } from 'express';

import { BadRequest } from '../../errors/bad-request.error.ts';
import { getProductsUseCase } from './get-products.use-case.ts';
import { getProductsQuerySchema } from './products.schema.ts';

export async function getProducts(req: Request, res: Response) {
  const result = getProductsQuerySchema.safeParse(req.query);

  if (!result.success) {
    throw new BadRequest();
  }

  const products = await getProductsUseCase(result.data);

  res.json(products);
}
