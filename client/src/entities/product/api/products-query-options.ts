import { queryOptions } from '@tanstack/react-query';

import { getProducts } from './get-products';

const PRODUCTS_STALE_TIME_MS = 1000 * 60 * 5;

const productQueryKeys = {
  list: (categoryId?: string) => ['products', categoryId ?? 'all'] as const,
};

export const productsQueryOptions = (categoryId?: string) =>
  queryOptions({
    queryKey: productQueryKeys.list(categoryId),

    queryFn: ({ signal }) =>
      getProducts({
        categoryId,
        signal,
      }),
    staleTime: PRODUCTS_STALE_TIME_MS,
  });
