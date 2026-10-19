import { authFetch, createApiError, readJson, type RequestOptions } from '@/shared/api';

import type { FavoriteProductId } from '../model/favorite.types';
import type { FavoritesResponse } from './favorites.types';

export const getFavorites = async ({ signal }: RequestOptions = {}): Promise<
  FavoriteProductId[]
> => {
  const response = await authFetch('/api/favorites', { signal });

  if (!response.ok) {
    throw await createApiError(response);
  }

  const { productIds } = await readJson<FavoritesResponse>(response);

  return productIds;
};
