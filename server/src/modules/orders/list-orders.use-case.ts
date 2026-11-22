import { findOrders } from './orders.repository.ts';
import type { ListOrdersQuery } from './orders.schema.ts';

export async function listOrdersUseCase(userId: string, { limit, cursor }: ListOrdersQuery) {
  const rows = await findOrders(userId, limit + 1, cursor);
  const items = rows.slice(0, limit);
  const lastOrder = items.at(-1);
  const nextCursor =
    rows.length > limit && lastOrder
      ? Buffer.from(JSON.stringify({ createdAt: lastOrder.createdAt, id: lastOrder.id })).toString(
          'base64url',
        )
      : null;

  return { items, nextCursor };
}
