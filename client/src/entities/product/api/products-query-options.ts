import { queryOptions } from '@tanstack/react-query';

import { getProducts } from './get-products';

const productQueryKeys = {
  list: (categoryId: string) => ['products', categoryId] as const,
};

export const productsQueryOptions = (categoryId: string) =>
  queryOptions({
    queryKey: productQueryKeys.list(categoryId),

    queryFn: ({ signal }) =>
      getProducts({
        categoryId,
        signal,
      }),
    staleTime: 1000 * 60 * 5,
  });
