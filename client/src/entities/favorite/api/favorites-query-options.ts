import { queryOptions } from '@tanstack/react-query';

import { getFavorites } from './get-favorites';

export const favoritesQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ['favorites', userId],
    queryFn: ({ signal }) => getFavorites({ signal }),
    staleTime: 1000 * 60 * 5,
  });
