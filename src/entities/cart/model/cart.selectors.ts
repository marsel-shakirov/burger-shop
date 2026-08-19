import type { CartItem, CartState } from './cart.types';

export const selectProductQuantity = (productId: CartItem['productId']) => (state: CartState) =>
  state.items.find((item) => item.productId === productId)?.quantity ?? 0;
