import { type QueryClient, queryOptions } from '@tanstack/react-query';

import { getBonus } from './get-bonus';

export const BONUS_QUERY_KEY = ['bonus'] as const;

export const bonusQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: [...BONUS_QUERY_KEY, userId],
    queryFn: ({ signal }) => getBonus({ signal }),
    staleTime: 1000 * 60,
  });

export const removeBonusQueries = (queryClient: QueryClient) =>
  queryClient.removeQueries({ queryKey: BONUS_QUERY_KEY });
