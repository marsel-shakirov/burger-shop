import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import type { CartState } from './cart.types';

export const useCartStore = create<CartState>()(
  devtools((set) => ({
    items: [],
    addItem: ({ productId, unitPrice }) =>
      set((state) => {
        const existItem = state.items.find((item) => item.productId === productId);

        if (existItem) {
          return {
            items: state.items.map((item) =>
              item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item,
            ),
          };
        } else {
          return { items: [...state.items, { productId, unitPrice, quantity: 1 }] };
        }
      }),
  })),
);
