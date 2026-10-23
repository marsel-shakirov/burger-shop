import type { QueryClient } from '@tanstack/react-query';

import { BONUS_QUERY_KEY } from '@/entities/bonus';
import { CART_QUERY_KEY, cartQueryOptions, mergeGuestCart } from '@/entities/cart';
import {
  FAVORITES_QUERY_KEY,
  favoritesQueryOptions,
  mergeGuestFavorites,
} from '@/entities/favorite';
import { PROFILE_QUERY_KEY } from '@/entities/profile';
import type { SessionUser } from '@/entities/session';

export const syncUserData = (
  queryClient: QueryClient,
  user: SessionUser | null,
  prevUser: SessionUser | null,
) => {
  if (prevUser && user?.id !== prevUser.id) {
    queryClient.removeQueries({ queryKey: PROFILE_QUERY_KEY });
    queryClient.removeQueries({ queryKey: FAVORITES_QUERY_KEY });
    queryClient.removeQueries({ queryKey: CART_QUERY_KEY });
    queryClient.removeQueries({ queryKey: BONUS_QUERY_KEY });
  }

  if (user && user.id !== prevUser?.id) {
    queryClient.query(favoritesQueryOptions(user.id)).catch(() => {});
    mergeGuestFavorites(queryClient, user.id).catch(() => {});
    queryClient.query(cartQueryOptions(user.id)).catch(() => {});
    mergeGuestCart(queryClient, user.id).catch(() => {});
  }
};
