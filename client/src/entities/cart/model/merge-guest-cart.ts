import type { QueryClient } from '@tanstack/react-query';

import { cartQueryOptions } from '../api/cart-query-options';
import { mergeCart } from '../api/merge-cart';
import { useCartStore } from './cart.store';

export const mergeGuestCart = async (queryClient: QueryClient, userId: string) => {
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
