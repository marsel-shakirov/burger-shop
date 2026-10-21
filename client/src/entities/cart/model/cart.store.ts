import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import { CART_STORAGE_KEY, MAX_ITEM_QUANTITY, MIN_ITEM_QUANTITY } from '../config/cart.constants';
import {
  findCartEntryByProductId,
  getProductQuantity,
  setEntryQuantity,
} from '../lib/cart-entries';
import type { CartState } from './cart.types';

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set, get) => ({
        items: [],
        addItem: (productId) =>
          set((state) => {
            const quantity = getProductQuantity(state.items, productId);

            if (quantity >= MAX_ITEM_QUANTITY) {
              return state;
            }

            return { items: setEntryQuantity(state.items, { productId, quantity: quantity + 1 }) };
          }),
        incrementItem: (productId) => {
          if (findCartEntryByProductId(get().items, productId)) {
            get().addItem(productId);
          }
        },
        decrementItem: (productId) =>
          set((state) => {
            const quantity = getProductQuantity(state.items, productId);
            const nextQuantity = quantity > MIN_ITEM_QUANTITY ? quantity - 1 : 0;

            return { items: setEntryQuantity(state.items, { productId, quantity: nextQuantity }) };
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
        version: 1,
        partialize: (state) => ({ items: state.items }),
      },
    ),
  ),
);
