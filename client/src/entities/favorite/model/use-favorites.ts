import { useQuery } from '@tanstack/react-query';

import { useSessionStatus, useSessionUser } from '@/entities/session/@x/favorite';

import { favoritesQueryOptions } from '../api/favorites-query-options';
import { selectFavoriteIds } from './favorite.selectors';
import { useFavoriteStore } from './favorite.store';
import type { FavoriteProductId } from './favorite.types';

interface FavoritesResult<T> {
  data: T | undefined;
  isPending: boolean;
  isError: boolean;
  refetch: () => void;
}

const noop = () => {};

const EMPTY_IDS: FavoriteProductId[] = [];

const selectAll = (productIds: FavoriteProductId[]) => productIds;

const selectCount = (productIds: FavoriteProductId[]) => productIds.length;

const useFavorites = <T>(select: (productIds: FavoriteProductId[]) => T): FavoritesResult<T> => {
  const status = useSessionStatus();
  const user = useSessionUser();
  const guestIds = useFavoriteStore(selectFavoriteIds);
  const query = useQuery({
    ...favoritesQueryOptions(user?.id ?? ''),
    enabled: status === 'authenticated',
    select,
  });

  if (status === 'guest') {
    return { data: select(guestIds), isPending: false, isError: false, refetch: noop };
  }

  if (status === 'loading') {
    return { data: undefined, isPending: true, isError: false, refetch: noop };
  }

  return {
    data: query.data,
    isPending: query.isPending,
    isError: query.isLoadingError,
    refetch: () => void query.refetch(),
  };
};

export const useFavoriteIds = () => {
  const { data = EMPTY_IDS, isPending, isError, refetch } = useFavorites(selectAll);

  return { productIds: data, isPending, isError, refetch };
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
