import { queryOptions } from '@tanstack/react-query';

import { getCategories } from './get-categories';

const CATEGORY_STALE_TIME_MS = 1000 * 60 * 60;

export const categoriesQueryOptions = () =>
  queryOptions({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: CATEGORY_STALE_TIME_MS,
  });
