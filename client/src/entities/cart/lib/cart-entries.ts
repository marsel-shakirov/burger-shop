import type { CartEntry } from '../model/cart.types';

export const findCartEntryByProductId = (items: CartEntry[], productId: CartEntry['productId']) => {
  return items.find((item) => item.productId === productId);
};

export const getProductQuantity = (items: CartEntry[], productId: CartEntry['productId']) =>
  findCartEntryByProductId(items, productId)?.quantity ?? 0;

export const getTotalQuantity = (items: CartEntry[]) =>
  items.reduce((total, item) => total + item.quantity, 0);

export const setEntryQuantity = (items: CartEntry[], { productId, quantity }: CartEntry) => {
  if (quantity === 0) {
    return items.filter((item) => item.productId !== productId);
  }

  if (!findCartEntryByProductId(items, productId)) {
    return [{ productId, quantity }, ...items];
  }

  return items.map((item) => (item.productId === productId ? { ...item, quantity } : item));
};
