import { useQuery } from '@tanstack/react-query';

import { useSessionStatus, useSessionUser } from '@/entities/session/@x/cart';

import { cartQueryOptions } from '../api/cart-query-options';
import { getProductQuantity, getTotalQuantity } from '../lib/cart-entries';
import { selectCartItems } from './cart.selectors';
import { useCartStore } from './cart.store';
import type { CartEntry } from './cart.types';

interface CartResult<T> {
  data: T | undefined;
  isPending: boolean;
  isError: boolean;
  refetch: () => void;
}

const noop = () => {};

const EMPTY_ITEMS: CartEntry[] = [];

const selectAll = (items: CartEntry[]) => items;

const useCart = <T>(select: (items: CartEntry[]) => T): CartResult<T> => {
  const status = useSessionStatus();
  const user = useSessionUser();
  const guestItems = useCartStore(selectCartItems);
  const query = useQuery({
    ...cartQueryOptions(user?.id ?? ''),
    enabled: status === 'authenticated',
    select,
  });

  if (status === 'guest') {
    return { data: select(guestItems), isPending: false, isError: false, refetch: noop };
  }

  if (status === 'loading') {
    return { data: undefined, isPending: true, isError: false, refetch: noop };
  }

  return {
    data: query.data,
    isPending: query.isPending,
    isError: query.isLoadingError,
    refetch: () => void query.refetch(),
  };
};

export const useCartItems = () => {
  const { data = EMPTY_ITEMS, isPending, isError, refetch } = useCart(selectAll);

  return { items: data, isPending, isError, refetch };
};

export const useCartTotalQuantity = () => {
  const { data = 0, isPending, isError } = useCart(getTotalQuantity);

  return { totalQuantity: data, isPending, isError };
};

export const useProductQuantity = (productId: CartEntry['productId']) => {
  const { data = 0, isPending, isError } = useCart((items) => getProductQuantity(items, productId));

  return { quantity: data, isPending, isError };
};
