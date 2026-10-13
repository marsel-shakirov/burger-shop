import { deleteCartItem } from './cart.repository.ts';

export async function removeCartItemUseCase(userId: string, productId: number) {
  await deleteCartItem(userId, productId);
}
