import type { CartEntry } from './cart.types';

export const findCartEntryByProductId = (items: CartEntry[], productId: CartEntry['productId']) => {
  return items.find((item) => item.productId === productId);
};
