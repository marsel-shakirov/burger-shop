import type { QueryClient } from '@tanstack/react-query';

import { favoritesQueryOptions } from '../api/favorites-query-options';
import { mergeFavorites } from '../api/merge-favorites';
import { useFavoriteStore } from './favorite.store';

export const mergeGuestFavorites = async (queryClient: QueryClient, userId: string) => {
  const { productIds, clearFavorites } = useFavoriteStore.getState();

  if (productIds.length === 0) {
    return;
  }

  const mergedIds = await mergeFavorites(productIds);
  const { queryKey } = favoritesQueryOptions(userId);

  await queryClient.cancelQueries({ queryKey });
  queryClient.setQueryData(queryKey, mergedIds);
  clearFavorites();
};
