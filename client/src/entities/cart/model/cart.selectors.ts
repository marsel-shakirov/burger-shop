import { findCartEntryByProductId } from './cart.lib';
import type { CartEntry, CartState } from './cart.types';

export const selectProductQuantity = (productId: CartEntry['productId']) => (state: CartState) =>
  findCartEntryByProductId(state.items, productId)?.quantity ?? 0;

export const selectTotalPrice = (state: CartState) =>
  state.items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);

export const selectTotalQuantity = (state: CartState) =>
  state.items.reduce((total, item) => total + item.quantity, 0);
