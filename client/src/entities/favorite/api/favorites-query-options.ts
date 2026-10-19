import { queryOptions } from '@tanstack/react-query';

import { getFavorites } from './get-favorites';

export const FAVORITES_QUERY_KEY = ['favorites'] as const;

export const favoritesQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: [...FAVORITES_QUERY_KEY, userId],
    queryFn: ({ signal }) => getFavorites({ signal }),
    staleTime: 1000 * 30,
  });
