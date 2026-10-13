import type { CartState } from './cart.types';

export const selectCartItems = (state: CartState) => state.items;
