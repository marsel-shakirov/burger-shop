import { toProductReferenceError } from '../../lib/foreign-key-error.ts';
import { CART_PRODUCT_FK } from './cart.constants.ts';
import { insertCartItems } from './cart.repository.ts';
import type { CartItem } from './cart.types.ts';
import { getCartUseCase } from './get-cart.use-case.ts';

export async function mergeCartUseCase(userId: string, items: CartItem[]) {
  if (items.length > 0) {
    try {
      await insertCartItems(userId, items);
    } catch (error) {
      throw toProductReferenceError(error, CART_PRODUCT_FK);
    }
  }

  return getCartUseCase(userId);
}
