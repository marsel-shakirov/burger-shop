import type { QueryClient } from '@tanstack/react-query';

import { removeBonusQueries } from '@/entities/bonus';
import { cartQueryOptions, mergeGuestCart, removeCartQueries } from '@/entities/cart';
import {
  favoritesQueryOptions,
  mergeGuestFavorites,
  removeFavoritesQueries,
} from '@/entities/favorite';
import { removeProfileQueries } from '@/entities/profile';
import type { SessionUser } from '@/entities/session';

export const syncUserData = (
  queryClient: QueryClient,
  user: SessionUser | null,
  prevUser: SessionUser | null,
) => {
  if (prevUser && user?.id !== prevUser.id) {
    removeProfileQueries(queryClient);
    removeFavoritesQueries(queryClient);
    removeCartQueries(queryClient);
    removeBonusQueries(queryClient);
  }

  if (user && user.id !== prevUser?.id) {
    queryClient.query(favoritesQueryOptions(user.id)).catch(() => {});
    mergeGuestFavorites(queryClient, user.id).catch(() => {});
    queryClient.query(cartQueryOptions(user.id)).catch(() => {});
    mergeGuestCart(queryClient, user.id).catch(() => {});
  }
};
