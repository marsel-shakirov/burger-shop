import { authFetch, createApiError, readJson } from '@/shared/api';

import type { FavoriteProductId } from '../model/favorite.types';
import type { FavoritesResponse } from './favorites.types';

export const mergeFavorites = async (
  productIds: FavoriteProductId[],
): Promise<FavoriteProductId[]> => {
  const response = await authFetch('/api/favorites/merge', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productIds }),
  });

  if (!response.ok) {
    throw await createApiError(response);
  }

  const { productIds: mergedIds } = await readJson<FavoritesResponse>(response);

  return mergedIds;
};
