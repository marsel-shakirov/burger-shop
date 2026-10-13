import { deleteCartItems } from './cart.repository.ts';

export async function clearCartUseCase(userId: string) {
  await deleteCartItems(userId);
}
