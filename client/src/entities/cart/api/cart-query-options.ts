import { type QueryClient, queryOptions } from '@tanstack/react-query';

import { GUEST_CART_MERGE_QUERY_KEY } from '../config/cart.constants';

export const CART_QUERY_KEY = ['cart'] as const;

import { authFetch, createApiError, readJson, type RequestOptions } from '@/shared/api';

import type { CartEntry } from '../model/cart.types';
import type { CartResponse } from './cart.types';

const getCart = async ({ signal }: RequestOptions = {}): Promise<CartEntry[]> => {
  const response = await authFetch('/api/cart', { signal });

  if (!response.ok) {
    throw await createApiError(response);
  }

  const { items } = await readJson<CartResponse>(response);

  return items;
};

export const cartQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: [...CART_QUERY_KEY, userId],
    queryFn: ({ signal }) => getCart({ signal }),
    staleTime: 1000 * 30,
  });

export const removeCartQueries = (queryClient: QueryClient) => {
  queryClient.removeQueries({ queryKey: CART_QUERY_KEY });
  queryClient.removeQueries({ queryKey: GUEST_CART_MERGE_QUERY_KEY });
};
