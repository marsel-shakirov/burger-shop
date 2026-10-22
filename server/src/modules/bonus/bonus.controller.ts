import type { Request, Response } from 'express';

import { getUserId } from '../../lib/get-user-id.ts';
import { getBonusUseCase } from './get-bonus.use-case.ts';

export async function getBonus(req: Request, res: Response) {
  res.json(await getBonusUseCase(getUserId(req)));
}
