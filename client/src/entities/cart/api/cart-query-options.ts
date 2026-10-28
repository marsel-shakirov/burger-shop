import { type QueryClient, queryOptions } from '@tanstack/react-query';

import { getCart } from './get-cart';

export const CART_QUERY_KEY = ['cart'] as const;

export const cartQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: [...CART_QUERY_KEY, userId],
    queryFn: ({ signal }) => getCart({ signal }),
    staleTime: 1000 * 30,
  });

export const removeCartQueries = (queryClient: QueryClient) =>
  queryClient.removeQueries({ queryKey: CART_QUERY_KEY });
