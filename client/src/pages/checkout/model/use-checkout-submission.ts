import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';

import { cartQueryOptions } from '@/entities/cart';
import { ALL_PRODUCTS_PARAMS, productsQueryOptions } from '@/entities/product';
import { isApiError } from '@/shared/api';

import { createOrder, type CreateOrderDetails, type CreateOrderRequest } from '../api/create-order';

export interface OrderConfirmation {
  isPending: boolean;
  needsRetry: boolean;
  isBlocked: boolean;
  submit: (details: CreateOrderDetails) => void;
}

const isRejected = (error: unknown) =>
  isApiError(error) && error.status >= 400 && error.status < 500 && error.status !== 408;

const getConflictCode = (error: unknown) =>
  isApiError(error) && error.status === 409 ? error.code : undefined;

type RefreshStatus = 'idle' | 'pending' | 'failed' | 'ready';

export const useCheckoutSubmission = (userId: string) => {
  const queryClient = useQueryClient();
  const locked = useRef(false);
  const refreshing = useRef(false);
  const [refreshStatus, setRefreshStatus] = useState<RefreshStatus>('idle');

  const refreshOrder = async () => {
    if (refreshing.current) return;
    refreshing.current = true;
    setRefreshStatus('pending');
    const cart = cartQueryOptions(userId);
    const catalog = productsQueryOptions(ALL_PRODUCTS_PARAMS);

    await Promise.all([
      queryClient.cancelQueries({ queryKey: cart.queryKey, exact: true }),
      queryClient.cancelQueries({ queryKey: catalog.queryKey, exact: true }),
    ]);
    const results = await Promise.allSettled([
      queryClient.query({ ...cart, staleTime: 0, retry: false }),
      queryClient.query({ ...catalog, staleTime: 0, retry: false }),
    ]);

    refreshing.current = false;
    setRefreshStatus(results.every(({ status }) => status === 'fulfilled') ? 'ready' : 'failed');
  };

  const mutation = useMutation({
    mutationFn: createOrder,
    retry: false,
    gcTime: 0,
    onError: async (error) => {
      if (getConflictCode(error) === 'cart_changed') await refreshOrder();
      locked.current = false;
    },
  });

  const retryRequest =
    mutation.isError && !isRejected(mutation.error) ? mutation.variables : undefined;
  const conflictCode = getConflictCode(mutation.error);
  const isBlocked =
    refreshStatus === 'pending' ||
    refreshStatus === 'failed' ||
    conflictCode === 'order_total_too_large';

  const send = (request: CreateOrderRequest) => {
    if (locked.current) return;
    locked.current = true;
    setRefreshStatus('idle');
    mutation.mutate(request);
  };

  const confirmation: OrderConfirmation = {
    isPending: mutation.isPending,
    needsRetry: retryRequest !== undefined,
    isBlocked,
    submit: (details) => {
      if (locked.current || retryRequest || isBlocked) return;
      send({ ...details, idempotencyKey: crypto.randomUUID() });
    },
  };

  return {
    confirmation,
    order: mutation.data,
    isError: mutation.isError,
    conflictCode,
    refreshStatus,
    refreshOrder,
    retry: () => {
      if (retryRequest) send(retryRequest);
    },
  };
};
