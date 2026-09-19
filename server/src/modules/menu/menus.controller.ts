import type { Request, Response } from 'express';

import { getMenusUseCase } from './get-menus.use-case.ts';

export async function getMenus(_req: Request, res: Response) {
  const menus = await getMenusUseCase();

  res.json(menus);
}
