import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import { CART_STORAGE_KEY } from '../config/cart.constants';
import { getNextQuantity } from '../lib/cart-changes';
import { getProductQuantity, setEntryQuantity } from '../lib/cart-entries';
import type { CartItemAction, CartItemPayload, CartState } from './cart.types';

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set) => {
        const changeItem = (productId: CartItemPayload, action: CartItemAction) =>
          set((state) => {
            const quantity = getProductQuantity(state.items, productId);
            const nextQuantity = getNextQuantity(quantity, action);

            if (nextQuantity === quantity) {
              return state;
            }

            return { items: setEntryQuantity(state.items, { productId, quantity: nextQuantity }) };
          });

        return {
          items: [],
          addItem: (productId) => changeItem(productId, 'add'),
          incrementItem: (productId) => changeItem(productId, 'increment'),
          decrementItem: (productId) => changeItem(productId, 'decrement'),
          removeItem: (productId) => changeItem(productId, 'remove'),
          clearCart: () =>
            set({
              items: [],
            }),
        };
      },
      {
        name: CART_STORAGE_KEY,
        version: 1,
        partialize: (state) => ({ items: state.items }),
      },
    ),
    { name: 'cart-store' },
  ),
);
