import { queryOptions } from '@tanstack/react-query';

import { getCart } from './get-cart';

export const cartQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ['cart', userId],
    queryFn: ({ signal }) => getCart({ signal }),
    staleTime: 1000 * 30,
  });
