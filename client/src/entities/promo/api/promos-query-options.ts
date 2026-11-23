import { queryOptions } from '@tanstack/react-query';

import { createApiError, readJson, type RequestOptions } from '@/shared/api';

import type { Promo } from '../model/promo.types';

const PROMOS_STALE_TIME_MS = 1000 * 60 * 60;

const getPromos = async ({ signal }: RequestOptions = {}): Promise<Promo[]> => {
  const response = await fetch(`/api/promos`, { signal });

  if (!response.ok) {
    throw await createApiError(response);
  }

  return readJson<Promo[]>(response);
};

export const promosQueryOptions = () =>
  queryOptions({
    queryKey: ['promos'],
    queryFn: ({ signal }) => getPromos({ signal }),
    staleTime: PROMOS_STALE_TIME_MS,
  });
