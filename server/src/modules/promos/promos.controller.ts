import type { Request, Response } from 'express';

import { getPromosUseCase } from './get-promos.use-case.ts';

export async function getPromos(_req: Request, res: Response) {
  const promos = await getPromosUseCase();

  res.json(promos);
}
