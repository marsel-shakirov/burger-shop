import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getSessionState } from '@/entities/session/@x/cart';

import { CART_QUERY_KEY, cartQueryOptions } from '../api/cart-query-options';
import { deleteCart } from '../api/delete-cart';
import { deleteCartItem } from '../api/delete-cart-item';
import { updateCartItem } from '../api/update-cart-item';
import { applyCartChange, getNextQuantity, revertCartChange } from '../lib/cart-changes';
import { getProductQuantity } from '../lib/cart-entries';
import { useCartStore } from './cart.store';
import type { CartChange, CartItemAction, CartItemPayload } from './cart.types';

interface CartChangeVariables {
  userId: string;
  change: CartChange;
}

const CART_MUTATION_KEY = [...CART_QUERY_KEY, 'change'];

const GUEST_ACTIONS = {
  add: 'addItem',
  increment: 'incrementItem',
  decrement: 'decrementItem',
  remove: 'removeItem',
} as const;

const getQueryKey = (userId: string) => cartQueryOptions(userId).queryKey;

const sendChange = (change: CartChange) => {
  if (change.type === 'clear') {
    return deleteCart();
  }

  return change.quantity === 0 ? deleteCartItem(change.productId) : updateCartItem(change);
};

export const useCartActions = () => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: CART_MUTATION_KEY,
    scope: { id: 'cart' },
    mutationFn: ({ change }: CartChangeVariables) => sendChange(change),
    onMutate: async ({ userId, change }) => {
      const queryKey = getQueryKey(userId);

      await queryClient.cancelQueries({ queryKey });

      const previousItems = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (items) => items && applyCartChange(items, change));

      return { previousItems };
    },
    onError: (_error, { userId, change }, context) => {
      const previousItems = context?.previousItems;

      if (!previousItems) {
        return;
      }

      queryClient.setQueryData(getQueryKey(userId), (items) =>
        revertCartChange(items, previousItems, change),
      );
    },
    onSettled: (_data, _error, { userId }) => {
      if (queryClient.isMutating({ mutationKey: CART_MUTATION_KEY }) === 1) {
        return queryClient.invalidateQueries({ queryKey: getQueryKey(userId) });
      }
    },
  });

  const loadItems = (userId: string) =>
    queryClient.query({ ...cartQueryOptions(userId), staleTime: 'static' }).catch(() => undefined);

  const changeItem = async (productId: CartItemPayload, action: CartItemAction) => {
    const { status, user } = getSessionState();

    if (status === 'guest') {
      useCartStore.getState()[GUEST_ACTIONS[action]](productId);
      return;
    }

    if (!user) {
      return;
    }

    const items = await loadItems(user.id);

    if (!items) {
      return;
    }

    const currentQuantity = getProductQuantity(items, productId);
    const quantity = getNextQuantity(currentQuantity, action);

    if (quantity !== currentQuantity) {
      mutate({ userId: user.id, change: { type: 'item', productId, quantity } });
    }
  };

  const clearCart = () => {
    const { status, user } = getSessionState();

    if (status === 'guest') {
      useCartStore.getState().clearCart();
      return;
    }

    if (user) {
      mutate({ userId: user.id, change: { type: 'clear' } });
    }
  };

  return {
    addItem: (productId: CartItemPayload) => void changeItem(productId, 'add'),
    incrementItem: (productId: CartItemPayload) => void changeItem(productId, 'increment'),
    decrementItem: (productId: CartItemPayload) => void changeItem(productId, 'decrement'),
    removeItem: (productId: CartItemPayload) => void changeItem(productId, 'remove'),
    clearCart,
  };
};
