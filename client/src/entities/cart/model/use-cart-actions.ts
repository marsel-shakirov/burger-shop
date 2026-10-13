import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useSessionStore } from '@/entities/session/@x/cart';

import { cartQueryOptions } from '../api/cart-query-options';
import { deleteCart } from '../api/delete-cart';
import { deleteCartItem } from '../api/delete-cart-item';
import { updateCartItem } from '../api/update-cart-item';
import { MAX_ITEM_QUANTITY, MIN_ITEM_QUANTITY } from './cart.constants';
import { getProductQuantity, setEntryQuantity } from './cart.lib';
import { useCartStore } from './cart.store';
import type { CartEntry, CartItemPayload } from './cart.types';

type CartItemAction = 'add' | 'increment' | 'decrement' | 'remove';

type CartChange = ({ type: 'item' } & CartEntry) | { type: 'clear' };

interface CartChangeVariables {
  userId: string;
  change: CartChange;
}

const CART_MUTATION_KEY = ['cart', 'change'];

const GUEST_ACTIONS = {
  add: 'addItem',
  increment: 'incrementItem',
  decrement: 'decrementItem',
  remove: 'removeItem',
} as const;

const getQueryKey = (userId: string) => cartQueryOptions(userId).queryKey;

const getNextQuantity = (quantity: number, action: CartItemAction) => {
  switch (action) {
    case 'add':
      return Math.min(quantity + 1, MAX_ITEM_QUANTITY);
    case 'increment':
      return quantity > 0 ? Math.min(quantity + 1, MAX_ITEM_QUANTITY) : 0;
    case 'decrement':
      return quantity > MIN_ITEM_QUANTITY ? quantity - 1 : 0;
    case 'remove':
      return 0;
  }
};

const applyChange = (items: CartEntry[], change: CartChange) =>
  change.type === 'clear' ? [] : setEntryQuantity(items, change);

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

      queryClient.setQueryData(queryKey, (items) => items && applyChange(items, change));

      return { previousItems };
    },
    onError: (_error, { userId, change }, context) => {
      const previousItems = context?.previousItems;

      if (!previousItems) {
        return;
      }

      queryClient.setQueryData(getQueryKey(userId), (items) => {
        if (!items || change.type === 'clear') {
          return previousItems;
        }

        const quantity = getProductQuantity(previousItems, change.productId);

        return setEntryQuantity(items, { productId: change.productId, quantity });
      });
    },
    onSettled: (_data, _error, { userId }) => {
      if (queryClient.isMutating({ mutationKey: CART_MUTATION_KEY }) === 1) {
        return queryClient.invalidateQueries({ queryKey: getQueryKey(userId) });
      }
    },
  });

  const changeItem = (productId: CartItemPayload, action: CartItemAction) => {
    const { status, user } = useSessionStore.getState();

    if (status === 'guest') {
      useCartStore.getState()[GUEST_ACTIONS[action]](productId);
      return;
    }

    const items = user && queryClient.getQueryData(getQueryKey(user.id));

    if (!user || !items) {
      return;
    }

    const currentQuantity = getProductQuantity(items, productId);
    const quantity = getNextQuantity(currentQuantity, action);

    if (quantity !== currentQuantity) {
      mutate({ userId: user.id, change: { type: 'item', productId, quantity } });
    }
  };

  const clearCart = () => {
    const { status, user } = useSessionStore.getState();

    if (status === 'guest') {
      useCartStore.getState().clearCart();
      return;
    }

    if (user) {
      mutate({ userId: user.id, change: { type: 'clear' } });
    }
  };

  return {
    addItem: (productId: CartItemPayload) => changeItem(productId, 'add'),
    incrementItem: (productId: CartItemPayload) => changeItem(productId, 'increment'),
    decrementItem: (productId: CartItemPayload) => changeItem(productId, 'decrement'),
    removeItem: (productId: CartItemPayload) => changeItem(productId, 'remove'),
    clearCart,
  };
};
