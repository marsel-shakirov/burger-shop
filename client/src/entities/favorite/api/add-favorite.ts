import { authFetch, createApiError } from '@/shared/api';

import type { FavoriteProductId } from '../model/favorite.types';

export const addFavorite = async (productId: FavoriteProductId): Promise<void> => {
  const response = await authFetch(`/api/favorites/${productId}`, { method: 'PUT' });

  if (!response.ok) {
    throw await createApiError(response);
  }
};
