import type { PoolClient } from 'pg';

import { pool } from '../../db.ts';
import type { CreateOrderInput, OrderCursor } from './orders.schema.ts';

export type OrderCartItem = {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
};

type Order = {
  id: string;
  orderNumber: string;
  status: string;
  totalPrice: number;
};

const orderColumns = 'id, order_number::text AS "orderNumber", status, total_price AS "totalPrice"';

type OrderSummary = Order & { createdAt: string };

type OrderDetails = OrderSummary & {
  items: {
    lineNumber: number;
    productName: string;
    unitPrice: number;
    quantity: number;
  }[];
};

const orderSummaryColumns = `${orderColumns},
  to_char(created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"') AS "createdAt"`;

export async function findOrders(userId: string, limit: number, cursor?: OrderCursor) {
  const cursorCondition = cursor ? 'AND (created_at, id) < ($3::timestamptz, $4::uuid)' : '';
  const parameters = cursor ? [userId, limit, cursor.createdAt, cursor.id] : [userId, limit];

  const { rows } = await pool.query<OrderSummary>(
    `SELECT ${orderSummaryColumns}
       FROM public.orders
      WHERE user_id = $1
        ${cursorCondition}
      ORDER BY created_at DESC, id DESC
      LIMIT $2`,
    parameters,
  );

  return rows;
}

export async function findOrderDetails(userId: string, orderId: string) {
  const { rows } = await pool.query<OrderDetails>(
    `SELECT ${orderSummaryColumns},
            COALESCE((
              SELECT jsonb_agg(
                jsonb_build_object(
                  'lineNumber', item.line_number,
                  'productName', item.product_name,
                  'unitPrice', item.unit_price,
                  'quantity', item.quantity
                ) ORDER BY item.line_number
              )
              FROM public.order_items AS item
              WHERE item.order_id = orders.id
            ), '[]'::jsonb) AS items
       FROM public.orders
      WHERE user_id = $1 AND id = $2`,
    [userId, orderId],
  );

  return rows[0];
}

export async function withOrderTransaction<T>(
  userId: string,
  run: (client: PoolClient) => Promise<T>,
) {
  const client = await pool.connect();
  let destroyClient = false;

  try {
    await client.query('BEGIN ISOLATION LEVEL READ COMMITTED');
    await client.query("SELECT pg_advisory_xact_lock(hashtextextended('orders:' || $1, 0))", [
      userId,
    ]);
    const result = await run(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    try {
      await client.query('ROLLBACK');
    } catch {
      destroyClient = true;
    }
    throw error;
  } finally {
    client.release(destroyClient);
  }
}

export async function findOrderByKey(client: PoolClient, userId: string, key: string) {
  const result = await client.query<Order>(
    `SELECT ${orderColumns} FROM public.orders WHERE user_id = $1 AND idempotency_key = $2`,
    [userId, key],
  );
  return result.rows[0];
}

export async function lockOrderCart(client: PoolClient, userId: string) {
  const result = await client.query<OrderCartItem>(
    `SELECT p.id AS "productId", p.name AS "productName", c.quantity, p.price AS "unitPrice"
       FROM public.cart_items c
       JOIN public.products p ON p.id = c.product_id
      WHERE c.user_id = $1
      ORDER BY c.product_id
      FOR UPDATE OF c`,
    [userId],
  );
  return result.rows;
}

export async function insertOrder(
  client: PoolClient,
  userId: string,
  input: CreateOrderInput,
  totalPrice: number,
) {
  const result = await client.query<Order>(
    `INSERT INTO public.orders
       (user_id, idempotency_key, customer_name, customer_phone, customer_comment, total_price)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING ${orderColumns}`,
    [
      userId,
      input.idempotencyKey,
      input.customerName,
      input.customerPhone,
      input.customerComment || null,
      totalPrice,
    ],
  );
  return result.rows[0];
}

export async function insertOrderItems(
  client: PoolClient,
  orderId: string,
  items: OrderCartItem[],
) {
  await client.query(
    `INSERT INTO public.order_items (order_id, line_number, product_id, product_name, unit_price, quantity)
     SELECT $1, line_number, product_id, product_name, unit_price, quantity
       FROM unnest($2::int[], $3::text[], $4::int[], $5::smallint[]) WITH ORDINALITY
            AS items(product_id, product_name, unit_price, quantity, line_number)`,
    [
      orderId,
      items.map((item) => item.productId),
      items.map((item) => item.productName),
      items.map((item) => item.unitPrice),
      items.map((item) => item.quantity),
    ],
  );
}

export async function deleteOrderedCartItems(
  client: PoolClient,
  userId: string,
  items: OrderCartItem[],
) {
  await client.query(
    'DELETE FROM public.cart_items WHERE user_id = $1 AND product_id = ANY($2::int[])',
    [userId, items.map((item) => item.productId)],
  );
}
