import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { CART_QUERY_KEY, cartQueryOptions, mergeGuestCart } from '@/entities/cart';
import {
  FAVORITES_QUERY_KEY,
  favoritesQueryOptions,
  mergeGuestFavorites,
} from '@/entities/favorite';
import { PROFILE_QUERY_KEY } from '@/entities/profile';
import { useSessionStore } from '@/entities/session';

export const useSyncUserData = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribeStore = useSessionStore.subscribe((state, prevState) => {
      if (prevState.user && state.user?.id !== prevState.user.id) {
        queryClient.removeQueries({ queryKey: PROFILE_QUERY_KEY });
        queryClient.removeQueries({ queryKey: FAVORITES_QUERY_KEY });
        queryClient.removeQueries({ queryKey: CART_QUERY_KEY });
      }

      if (state.user && state.user.id !== prevState.user?.id) {
        queryClient.query(favoritesQueryOptions(state.user.id)).catch(() => {});
        mergeGuestFavorites(queryClient, state.user.id).catch(() => {});
        queryClient.query(cartQueryOptions(state.user.id)).catch(() => {});
        mergeGuestCart(queryClient, state.user.id).catch(() => {});
      }
    });

    return unsubscribeStore;
  }, [queryClient]);
};
