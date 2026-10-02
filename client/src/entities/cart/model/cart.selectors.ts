import { findCartEntryByProductId } from './cart.lib';
import type { CartEntry, CartState } from './cart.types';

export const selectCartItems = (state: CartState) => state.items;

export const selectHasItems = (state: CartState) => state.items.length > 0;

export const selectAddItem = (state: CartState) => state.addItem;

export const selectIncrementItem = (state: CartState) => state.incrementItem;

export const selectDecrementItem = (state: CartState) => state.decrementItem;

export const selectRemoveItem = (state: CartState) => state.removeItem;

export const selectClearCart = (state: CartState) => state.clearCart;

export const selectProductQuantity = (productId: CartEntry['productId']) => (state: CartState) =>
  findCartEntryByProductId(state.items, productId)?.quantity ?? 0;

export const selectTotalQuantity = (state: CartState) =>
  state.items.reduce((total, item) => total + item.quantity, 0);
