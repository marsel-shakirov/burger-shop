import { toCartError } from './cart.errors.ts';
import { insertCartItems } from './cart.repository.ts';
import type { CartItem } from './cart.types.ts';
import { getCartUseCase } from './get-cart.use-case.ts';

export async function mergeCartUseCase(userId: string, items: CartItem[]) {
  if (items.length > 0) {
    try {
      await insertCartItems(userId, items);
    } catch (error) {
      throw toCartError(error);
    }
  }

  return getCartUseCase(userId);
}
