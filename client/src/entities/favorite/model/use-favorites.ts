import { useQuery } from '@tanstack/react-query';

import { selectSessionStatus, selectUser, useSessionStore } from '@/entities/session/@x/favorite';

import { favoritesQueryOptions } from '../api/favorites-query-options';
import { selectFavoriteIds } from './favorite.selectors';
import { useFavoriteStore } from './favorite.store';
import type { FavoriteProductId } from './favorite.types';

interface FavoritesResult<T> {
  data: T | undefined;
  isPending: boolean;
  isError: boolean;
}

const EMPTY_IDS: FavoriteProductId[] = [];

const selectAll = (productIds: FavoriteProductId[]) => productIds;

const selectCount = (productIds: FavoriteProductId[]) => productIds.length;

const useFavorites = <T>(select: (productIds: FavoriteProductId[]) => T): FavoritesResult<T> => {
  const status = useSessionStore(selectSessionStatus);
  const user = useSessionStore(selectUser);
  const guestIds = useFavoriteStore(selectFavoriteIds);
  const query = useQuery({
    ...favoritesQueryOptions(user?.id ?? ''),
    enabled: status === 'authenticated',
    select,
  });

  if (status === 'guest') {
    return { data: select(guestIds), isPending: false, isError: false };
  }

  if (status === 'loading') {
    return { data: undefined, isPending: true, isError: false };
  }

  return { data: query.data, isPending: query.isPending, isError: query.isLoadingError };
};

export const useFavoriteIds = () => {
  const { data = EMPTY_IDS, isPending, isError } = useFavorites(selectAll);

  return { productIds: data, isPending, isError };
};

export const useFavoritesCount = () => {
  const { data = 0, isPending, isError } = useFavorites(selectCount);

  return { count: data, isPending, isError };
};

export const useIsFavorite = (productId: FavoriteProductId) => {
  const {
    data = false,
    isPending,
    isError,
  } = useFavorites((productIds) => productIds.includes(productId));

  return { isFavorite: data, isPending, isError };
};
