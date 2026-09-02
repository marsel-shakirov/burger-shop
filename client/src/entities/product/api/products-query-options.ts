import { queryOptions } from '@tanstack/react-query';

import type { ProductsQuery } from '../model/product.types';
import { getProducts } from './get-products';

const PRODUCTS_STALE_TIME_MS = 1000 * 60 * 5;

const productQueryKeys = {
  list: ({ categoryId, sortBy }: ProductsQuery) =>
    [
      'products',
      {
        categoryId: categoryId ?? null,
        sortBy,
      },
    ] as const,
};

export const productsQueryOptions = (query: ProductsQuery) =>
  queryOptions({
    queryKey: productQueryKeys.list(query),

    queryFn: ({ signal }) =>
      getProducts({
        ...query,
        signal,
      }),
    staleTime: PRODUCTS_STALE_TIME_MS,
  });
