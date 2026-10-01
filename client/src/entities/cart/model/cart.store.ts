import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import { CART_STORAGE_KEY, MAX_ITEM_QUANTITY, MIN_ITEM_QUANTITY } from './cart.constants';
import { findCartEntryByProductId } from './cart.lib';
import type { CartState } from './cart.types';

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set) => ({
        items: [],
        addItem: (productId) =>
          set((state) => {
            const currentItem = findCartEntryByProductId(state.items, productId);

            if (currentItem && currentItem?.quantity >= MAX_ITEM_QUANTITY) {
              return state;
            }

            if (currentItem) {
              return {
                items: state.items.map((item) =>
                  item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item,
                ),
              };
            } else {
              return { items: [...state.items, { productId, quantity: 1 }] };
            }
          }),
        incrementItem: (productId) =>
          set((state) => {
            const currentItem = findCartEntryByProductId(state.items, productId);

            if (!currentItem || currentItem.quantity >= MAX_ITEM_QUANTITY) {
              return state;
            }

            return {
              items: state.items.map((item) =>
                item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item,
              ),
            };
          }),
        decrementItem: (productId) =>
          set((state) => {
            const currentItem = findCartEntryByProductId(state.items, productId);

            if (!currentItem || currentItem.quantity <= MIN_ITEM_QUANTITY) {
              return {
                items: state.items.filter((item) => item.productId !== productId),
              };
            }

            return {
              items: state.items.map((item) =>
                item.productId === productId ? { ...item, quantity: item.quantity - 1 } : item,
              ),
            };
          }),
        removeItem: (productId) =>
          set((state) => {
            return {
              items: state.items.filter((item) => item.productId !== productId),
            };
          }),
        clearCart: () =>
          set({
            items: [],
          }),
      }),
      {
        name: CART_STORAGE_KEY,
        version: 2,
        partialize: (state) => ({ items: state.items }),
        migrate: (persistedState) => {
          const { items } = persistedState as Pick<CartState, 'items'>;

          return { items: items.map(({ productId, quantity }) => ({ productId, quantity })) };
        },
      },
    ),
  ),
);
