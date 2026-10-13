import { pool } from '../../db.ts';
import { CART_MAX_QUANTITY } from './cart.constants.ts';
import type { CartItem, CartItemRow } from './cart.types.ts';

export async function findCartItems(userId: string) {
  const result = await pool.query<CartItemRow>(
    'SELECT product_id, quantity FROM cart_items WHERE user_id = $1 ORDER BY created_at DESC, product_id DESC',
    [userId],
  );
  return result.rows;
}

export async function upsertCartItem(userId: string, productId: number, quantity: number) {
  await pool.query(
    `INSERT INTO cart_items (user_id, product_id, quantity) VALUES ($1, $2, $3)
     ON CONFLICT (user_id, product_id) DO UPDATE SET quantity = EXCLUDED.quantity`,
    [userId, productId, quantity],
  );
}

export async function insertCartItems(userId: string, items: CartItem[]) {
  await pool.query(
    `INSERT INTO cart_items (user_id, product_id, quantity, created_at)
     SELECT $1, products.id, LEAST(sum(items.quantity), $4::int),
            now() - min(items.ord) * interval '1 millisecond'
       FROM unnest($2::int[], $3::int[]) WITH ORDINALITY AS items(id, quantity, ord)
       JOIN products ON products.id = items.id
      GROUP BY products.id
     ON CONFLICT (user_id, product_id)
     DO UPDATE SET quantity = LEAST(cart_items.quantity + EXCLUDED.quantity, $4::int)`,
    [
      userId,
      items.map((item) => item.productId),
      items.map((item) => item.quantity),
      CART_MAX_QUANTITY,
    ],
  );
}

export async function deleteCartItem(userId: string, productId: number) {
  await pool.query('DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2', [
    userId,
    productId,
  ]);
}

export async function deleteCartItems(userId: string) {
  await pool.query('DELETE FROM cart_items WHERE user_id = $1', [userId]);
}
