import { Conflict } from '../../errors/conflict.error.ts';
import {
  deleteOrderedCartItems,
  findOrderByKey,
  insertOrder,
  insertOrderItems,
  lockOrderCart,
  withOrderTransaction,
} from './orders.repository.ts';
import type { CreateOrderInput } from './orders.schema.ts';

export function createOrderUseCase(userId: string, input: CreateOrderInput) {
  return withOrderTransaction(userId, async (client) => {
    const existing = await findOrderByKey(client, userId, input.idempotencyKey);
    if (existing) return { order: existing, created: false };

    const items = await lockOrderCart(client, userId);
    if (items.length === 0) throw new Conflict('Cart is empty', 'cart_empty');

    const expected = new Map(input.items.map((item) => [item.productId, item]));
    const cartMatches =
      items.length === expected.size &&
      items.every(({ productId, unitPrice, quantity }) => {
        const item = expected.get(productId);
        return item !== undefined && item.unitPrice === unitPrice && item.quantity === quantity;
      });

    if (!cartMatches) throw new Conflict('Cart has changed', 'cart_changed');

    const totalPrice = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    if (totalPrice > 2_147_483_647) {
      throw new Conflict('Order total is too large', 'order_total_too_large');
    }

    const order = await insertOrder(client, userId, input, totalPrice);
    await insertOrderItems(client, order.id, items);
    await deleteOrderedCartItems(client, userId, items);

    return { order, created: true };
  });
}
