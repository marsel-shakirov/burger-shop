import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import { FAVORITE_STORAGE_KEY } from './favorite.constants';
import type { FavoriteState } from './favorite.types';

export const useFavoriteStore = create<FavoriteState>()(
  devtools(
    persist(
      (set) => ({
        productIds: [],
        toggleFavorite: (productId) =>
          set((state) => ({
            productIds: state.productIds.includes(productId)
              ? state.productIds.filter((id) => id !== productId)
              : [productId, ...state.productIds],
          })),
        removeFavorite: (productId) =>
          set((state) => ({
            productIds: state.productIds.filter((id) => id !== productId),
          })),
        clearFavorites: () =>
          set({
            productIds: [],
          }),
      }),
      {
        name: FAVORITE_STORAGE_KEY,
        version: 1,
        partialize: (state) => ({ productIds: state.productIds }),
      },
    ),
    { name: 'favorite-store' },
  ),
);
