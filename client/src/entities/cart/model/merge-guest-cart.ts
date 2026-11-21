import { type QueryClient, queryOptions, useQuery } from '@tanstack/react-query';

import { useSessionUser } from '@/entities/session/@x/cart';

import { cartQueryOptions } from '../api/cart-query-options';
import { mergeCart } from '../api/merge-cart';
import { GUEST_CART_MERGE_LOCK, GUEST_CART_MERGE_QUERY_KEY } from '../config/cart.constants';
import { useCartStore } from './cart.store';

const mergeStoredCart = async (queryClient: QueryClient, userId: string) => {
  await useCartStore.persist.rehydrate();

  const { items, clearCart } = useCartStore.getState();

  if (items.length === 0) {
    return;
  }

  const mergedItems = await mergeCart(items);
  const { queryKey } = cartQueryOptions(userId);

  await queryClient.cancelQueries({ queryKey });
  queryClient.setQueryData(queryKey, mergedItems);
  clearCart();
};

const guestCartMergeOptions = (userId: string) =>
  queryOptions({
    queryKey: [...GUEST_CART_MERGE_QUERY_KEY, userId],
    queryFn: async ({ client }) => {
      await navigator.locks.request(GUEST_CART_MERGE_LOCK, () => mergeStoredCart(client, userId));
      return true;
    },
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
    retryOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

export const mergeGuestCart = async (queryClient: QueryClient, userId: string) => {
  await queryClient.query(guestCartMergeOptions(userId));
};

export const useGuestCartMerge = () => {
  const user = useSessionUser();

  return useQuery({ ...guestCartMergeOptions(user?.id ?? ''), enabled: Boolean(user) });
};
