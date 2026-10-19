import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getSessionState } from '@/entities/session/@x/favorite';

import { addFavorite } from '../api/add-favorite';
import { FAVORITES_QUERY_KEY, favoritesQueryOptions } from '../api/favorites-query-options';
import { removeFavorite } from '../api/remove-favorite';
import { useFavoriteStore } from './favorite.store';
import type { FavoriteProductId } from './favorite.types';

type FavoriteAction = 'add' | 'remove';

interface FavoriteChange {
  productId: FavoriteProductId;
  action: FavoriteAction;
}

interface ToggleFavoriteVariables extends FavoriteChange {
  userId: string;
}

const TOGGLE_MUTATION_KEY = [...FAVORITES_QUERY_KEY, 'toggle'];

const getQueryKey = (userId: string) => favoritesQueryOptions(userId).queryKey;

const applyChange = (productIds: FavoriteProductId[], { productId, action }: FavoriteChange) => {
  const rest = productIds.filter((id) => id !== productId);

  return action === 'add' ? [productId, ...rest] : rest;
};

export const useFavoriteActions = () => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: TOGGLE_MUTATION_KEY,
    scope: { id: 'favorites' },
    mutationFn: ({ productId, action }: ToggleFavoriteVariables) =>
      action === 'add' ? addFavorite(productId) : removeFavorite(productId),
    onMutate: async ({ userId, ...change }) => {
      const queryKey = getQueryKey(userId);

      await queryClient.cancelQueries({ queryKey });
      queryClient.setQueryData(
        queryKey,
        (productIds) => productIds && applyChange(productIds, change),
      );
    },
    onError: (_error, { userId, productId, action }) => {
      const revert: FavoriteChange = { productId, action: action === 'add' ? 'remove' : 'add' };

      queryClient.setQueryData(
        getQueryKey(userId),
        (productIds) => productIds && applyChange(productIds, revert),
      );
    },
    onSettled: (_data, _error, { userId }) => {
      if (queryClient.isMutating({ mutationKey: TOGGLE_MUTATION_KEY }) === 1) {
        return queryClient.invalidateQueries({ queryKey: getQueryKey(userId) });
      }
    },
  });

  const toggleFavorite = (productId: FavoriteProductId) => {
    const { status, user } = getSessionState();

    if (status === 'guest') {
      useFavoriteStore.getState().toggleFavorite(productId);
      return;
    }

    if (!user) {
      return;
    }

    const isFavorite = queryClient.getQueryData(getQueryKey(user.id))?.includes(productId) ?? false;

    mutate({ userId: user.id, productId, action: isFavorite ? 'remove' : 'add' });
  };

  return { toggleFavorite };
};
