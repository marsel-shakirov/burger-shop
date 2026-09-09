import type { Request, Response } from 'express';

import { pool } from '../../db.ts';

export async function getCategories(_req: Request, res: Response) {
  const data = await pool.query('SELECT * FROM categories');

  res.json(data.rows);
}
