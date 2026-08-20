import type { CartItem, CartState } from './cart.types';

export const selectProductQuantity = (productId: CartItem['productId']) => (state: CartState) =>
  state.items.find((item) => item.productId === productId)?.quantity ?? 0;

export const selectTotalPrice = (state: CartState) =>
  state.items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);

export const selectTotalQuantity = (state: CartState) =>
  state.items.reduce((total, item) => total + item.quantity, 0);
