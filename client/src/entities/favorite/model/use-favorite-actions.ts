import { useMutation, useQueryClient } from '@tanstack/react-query';

import { getSessionState } from '@/entities/session/@x/favorite';

import { addFavorite } from '../api/add-favorite';
import { FAVORITES_QUERY_KEY, favoritesQueryOptions } from '../api/favorites-query-options';
import { removeFavorite } from '../api/remove-favorite';
import { applyFavoriteChange, revertFavoriteChange } from '../lib/favorite-changes';
import { useFavoriteStore } from './favorite.store';
import type { FavoriteChange, FavoriteProductId } from './favorite.types';

interface ToggleFavoriteVariables extends FavoriteChange {
  userId: string;
}

const TOGGLE_MUTATION_KEY = [...FAVORITES_QUERY_KEY, 'toggle'];

const getQueryKey = (userId: string) => favoritesQueryOptions(userId).queryKey;

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
        (productIds) => productIds && applyFavoriteChange(productIds, change),
      );
    },
    onError: (_error, { userId, ...change }) => {
      queryClient.setQueryData(
        getQueryKey(userId),
        (productIds) => productIds && revertFavoriteChange(productIds, change),
      );
    },
    onSettled: (_data, _error, { userId }) => {
      if (queryClient.isMutating({ mutationKey: TOGGLE_MUTATION_KEY }) === 1) {
        return queryClient.invalidateQueries({ queryKey: getQueryKey(userId) });
      }
    },
  });

  const loadProductIds = (userId: string) =>
    queryClient
      .query({ ...favoritesQueryOptions(userId), staleTime: 'static' })
      .catch(() => undefined);

  const toggleFavorite = async (productId: FavoriteProductId) => {
    const { status, user } = getSessionState();

    if (status === 'guest') {
      useFavoriteStore.getState().toggleFavorite(productId);
      return;
    }

    if (!user) {
      return;
    }

    const productIds = await loadProductIds(user.id);

    if (!productIds) {
      return;
    }

    const isFavorite = productIds.includes(productId);

    mutate({ userId: user.id, productId, action: isFavorite ? 'remove' : 'add' });
  };

  return { toggleFavorite: (productId: FavoriteProductId) => void toggleFavorite(productId) };
};
