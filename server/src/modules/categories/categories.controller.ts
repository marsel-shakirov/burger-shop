import type { Request, Response } from 'express';

import { pool } from '../../db.ts';

export async function getCategories(_req: Request, res: Response) {
  const categories = await pool.query('SELECT id, slug, name FROM categories');

  res.json(categories.rows);
}
