import { pool } from '../../db.ts';
import type { FavoriteRow } from './favorites.types.ts';

export async function findFavorites(userId: string) {
  const result = await pool.query<FavoriteRow>(
    'SELECT product_id FROM favorites WHERE user_id = $1 ORDER BY created_at DESC, product_id DESC',
    [userId],
  );
  return result.rows;
}

export async function insertFavorite(userId: string, productId: number) {
  await pool.query(
    'INSERT INTO favorites (user_id, product_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
    [userId, productId],
  );
}

export async function insertFavorites(userId: string, productIds: number[]) {
  await pool.query(
    `INSERT INTO favorites (user_id, product_id, created_at)
     SELECT $1, products.id, now() - min(ids.ord) * interval '1 millisecond'
       FROM unnest($2::int[]) WITH ORDINALITY AS ids(id, ord)
       JOIN products ON products.id = ids.id
      GROUP BY products.id
     ON CONFLICT DO NOTHING`,
    [userId, productIds],
  );
}

export async function deleteFavorite(userId: string, productId: number) {
  await pool.query('DELETE FROM favorites WHERE user_id = $1 AND product_id = $2', [
    userId,
    productId,
  ]);
}
