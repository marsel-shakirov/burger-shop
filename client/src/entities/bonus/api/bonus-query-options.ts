import { type QueryClient, queryOptions } from '@tanstack/react-query';

import { authFetch, createApiError, readJson, type RequestOptions } from '@/shared/api';

import type { Bonus } from '../model/bonus.types';

const BONUS_QUERY_KEY = ['bonus'] as const;

const getBonus = async ({ signal }: RequestOptions = {}): Promise<Bonus> => {
  const response = await authFetch('/api/bonus', { signal });

  if (!response.ok) {
    throw await createApiError(response);
  }

  return readJson<Bonus>(response);
};

export const bonusQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: [...BONUS_QUERY_KEY, userId],
    queryFn: ({ signal }) => getBonus({ signal }),
    staleTime: 1000 * 60,
  });

export const removeBonusQueries = (queryClient: QueryClient) =>
  queryClient.removeQueries({ queryKey: BONUS_QUERY_KEY });
