import { queryOptions } from '@tanstack/react-query';

import { getPromos } from './get-promos';

const PROMOS_STALE_TIME_MS = 1000 * 60 * 60;

export const promosQueryOptions = () =>
  queryOptions({
    queryKey: ['promos'],
    queryFn: ({ signal }) => getPromos({ signal }),
    staleTime: PROMOS_STALE_TIME_MS,
  });
