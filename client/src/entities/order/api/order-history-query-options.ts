import { infiniteQueryOptions, type QueryClient } from '@tanstack/react-query';

import { authFetch, createApiError, readJson } from '@/shared/api';

import type { OrderHistoryPage } from './order-history.types';

const ORDER_HISTORY_QUERY_KEY = ['order-history'] as const;

export const orderHistoryQueryKey = (userId: string) =>
  [...ORDER_HISTORY_QUERY_KEY, userId] as const;

const getOrderHistory = async (cursor: string | null, signal: AbortSignal) => {
  const path = cursor === null ? '/api/orders' : `/api/orders?${new URLSearchParams({ cursor })}`;

  const response = await authFetch(path, { signal });
  if (!response.ok) throw await createApiError(response);

  return readJson<OrderHistoryPage>(response);
};

export const orderHistoryQueryOptions = (userId: string) =>
  infiniteQueryOptions({
    queryKey: orderHistoryQueryKey(userId),
    queryFn: ({ pageParam, signal }) => getOrderHistory(pageParam, signal),
    initialPageParam: null as string | null,
    getNextPageParam: (page) => page.nextCursor,
    retry: false,
  });

export const removeOrderHistoryQueries = (queryClient: QueryClient) =>
  queryClient.removeQueries({ queryKey: ORDER_HISTORY_QUERY_KEY });
