import type { QueryClient } from '@tanstack/react-query';

import { cartQueryOptions } from '../api/cart-query-options';
import { mergeCart } from '../api/merge-cart';
import { GUEST_CART_MERGE_LOCK } from '../config/cart.constants';
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

export const mergeGuestCart = async (queryClient: QueryClient, userId: string) => {
  await navigator.locks.request(GUEST_CART_MERGE_LOCK, () => mergeStoredCart(queryClient, userId));
};
