import { toCartResponse } from './cart.mapper.ts';
import { findCartItems } from './cart.repository.ts';

export async function getCartUseCase(userId: string) {
  return toCartResponse(await findCartItems(userId));
}
