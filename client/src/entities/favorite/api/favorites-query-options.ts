import { type QueryClient, queryOptions } from '@tanstack/react-query';

import { authFetch, createApiError, readJson, type RequestOptions } from '@/shared/api';

import type { FavoriteProductId } from '../model/favorite.types';
import type { FavoritesResponse } from './favorites.types';

export const FAVORITES_QUERY_KEY = ['favorites'] as const;

const getFavorites = async ({ signal }: RequestOptions = {}): Promise<FavoriteProductId[]> => {
  const response = await authFetch('/api/favorites', { signal });

  if (!response.ok) {
    throw await createApiError(response);
  }

  const { productIds } = await readJson<FavoritesResponse>(response);

  return productIds;
};

export const favoritesQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: [...FAVORITES_QUERY_KEY, userId],
    queryFn: ({ signal }) => getFavorites({ signal }),
    staleTime: 1000 * 30,
  });

export const removeFavoritesQueries = (queryClient: QueryClient) =>
  queryClient.removeQueries({ queryKey: FAVORITES_QUERY_KEY });
