import { toCartError } from './cart.errors.ts';
import { upsertCartItem } from './cart.repository.ts';

export async function updateCartItemUseCase(userId: string, productId: number, quantity: number) {
  try {
    await upsertCartItem(userId, productId, quantity);
  } catch (error) {
    throw toCartError(error);
  }
}
