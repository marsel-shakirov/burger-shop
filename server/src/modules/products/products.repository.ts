import { pool } from '../../db.ts';
import type { ProductRow } from './products.types.ts';

interface FindProductsParams {
  menu?: string;
  category?: string;
  orderColumn: string;
  order: 'asc' | 'desc';
}

export async function findProducts({
  menu,
  category,
  orderColumn,
  order,
}: FindProductsParams): Promise<ProductRow[]> {
  const conditions: string[] = [];
  const values: unknown[] = [];

  if (menu) {
    values.push(menu);
    conditions.push(`menus.slug = $${values.length}`);
  }

  if (category) {
    values.push(category);
    conditions.push(`categories.slug = $${values.length}`);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const results = await pool.query<ProductRow>(
    `SELECT products.*
       FROM products
       JOIN categories ON products.category_id = categories.id
       JOIN menus ON categories.menu_id = menus.id
       ${whereClause}
       ORDER BY products.${orderColumn} ${order}`,
    values,
  );

  return results.rows;
}
