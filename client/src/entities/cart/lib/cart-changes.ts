import { MAX_ITEM_QUANTITY, MIN_ITEM_QUANTITY } from '../config/cart.constants';
import type { CartChange, CartEntry, CartItemAction } from '../model/cart.types';
import { getProductQuantity, setEntryQuantity } from './cart-entries';

export const getNextQuantity = (quantity: number, action: CartItemAction) => {
  switch (action) {
    case 'add':
      return Math.min(quantity + 1, MAX_ITEM_QUANTITY);
    case 'increment':
      return quantity > 0 ? Math.min(quantity + 1, MAX_ITEM_QUANTITY) : 0;
    case 'decrement':
      return quantity > MIN_ITEM_QUANTITY ? quantity - 1 : 0;
    case 'remove':
      return 0;
  }
};

export const applyCartChange = (items: CartEntry[], change: CartChange) =>
  change.type === 'clear' ? [] : setEntryQuantity(items, change);

export const revertCartChange = (
  items: CartEntry[] | undefined,
  previousItems: CartEntry[],
  change: CartChange,
) => {
  if (!items || change.type === 'clear') {
    return previousItems;
  }

  const quantity = getProductQuantity(previousItems, change.productId);

  return setEntryQuantity(items, { productId: change.productId, quantity });
};
