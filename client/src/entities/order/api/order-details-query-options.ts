import { type QueryClient, queryOptions } from '@tanstack/react-query';

import { authFetch, createApiError, readJson } from '@/shared/api';

import type { OrderDetails } from './order.types';

const ORDER_DETAILS_QUERY_KEY = ['order-details'] as const;

const getOrderDetails = async (orderId: string, signal: AbortSignal): Promise<OrderDetails> => {
  const response = await authFetch(`/api/orders/${encodeURIComponent(orderId)}`, { signal });

  if (!response.ok) throw await createApiError(response);

  return readJson<OrderDetails>(response);
};

export const orderDetailsQueryOptions = (userId: string, orderId: string) =>
  queryOptions({
    queryKey: [...ORDER_DETAILS_QUERY_KEY, userId, orderId],
    queryFn: ({ signal }) => getOrderDetails(orderId, signal),
    retry: false,
  });

export const removeOrderDetailsQueries = (queryClient: QueryClient) =>
  queryClient.removeQueries({ queryKey: ORDER_DETAILS_QUERY_KEY });
