import type { Request, Response } from 'express';

import { pool } from '../../db.ts';
import { BadRequest } from '../../errors/bad-request.error.ts';
import { getProductsQuerySchema } from './products.schema.ts';

const PRODUCT_SORT_COLUMNS = {
  popularity: 'popularity',
  price: 'price',
  rating: 'rating',
} as const;

export async function getProducts(req: Request, res: Response) {
  const result = getProductsQuerySchema.safeParse(req.query);

  if (!result.success) {
    throw new BadRequest();
  }

  const { category, sort, order } = result.data;

  const conditions: string[] = [];
  const values: unknown[] = [];

  if (category) {
    values.push(category);
    conditions.push(`categories.slug = $${values.length}`);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const orderColumn = PRODUCT_SORT_COLUMNS[sort];

  const products = await pool.query(
    `SELECT products.*
     FROM products
     JOIN categories ON products.category_id = categories.id
     ${whereClause}
     ORDER BY products.${orderColumn} ${order}`,
    values,
  );

  res.json(products.rows);
}
