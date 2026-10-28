import { toProductReferenceError } from '../../lib/foreign-key-error.ts';
import { CART_PRODUCT_FK } from './cart.constants.ts';
import { upsertCartItem } from './cart.repository.ts';

export async function updateCartItemUseCase(userId: string, productId: number, quantity: number) {
  try {
    await upsertCartItem(userId, productId, quantity);
  } catch (error) {
    throw toProductReferenceError(error, CART_PRODUCT_FK);
  }
}
