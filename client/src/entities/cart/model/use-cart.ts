import { useQuery } from '@tanstack/react-query';

import { useSessionStatus, useSessionUser } from '@/entities/session/@x/cart';

import { cartQueryOptions } from '../api/cart-query-options';
import { selectCartItems } from './cart.selectors';
import { useCartStore } from './cart.store';
import type { CartEntry } from './cart.types';
import { getProductQuantity, getTotalQuantity } from './cart-entries';

interface CartResult<T> {
  data: T | undefined;
  isPending: boolean;
  isError: boolean;
}

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
    return { data: select(guestItems), isPending: false, isError: false };
  }

  if (status === 'loading') {
    return { data: undefined, isPending: true, isError: false };
  }

  return { data: query.data, isPending: query.isPending, isError: query.isLoadingError };
};

export const useCartItems = () => {
  const { data = EMPTY_ITEMS, isPending, isError } = useCart(selectAll);

  return { items: data, isPending, isError };
};

export const useCartTotalQuantity = () => {
  const { data = 0, isPending, isError } = useCart(getTotalQuantity);

  return { totalQuantity: data, isPending, isError };
};

export const useProductQuantity = (productId: CartEntry['productId']) => {
  const { data = 0, isPending, isError } = useCart((items) => getProductQuantity(items, productId));

  return { quantity: data, isPending, isError };
};
