import { toFavoriteError } from './favorites.errors.ts';
import { insertFavorites } from './favorites.repository.ts';
import { getFavoritesUseCase } from './get-favorites.use-case.ts';

export async function mergeFavoritesUseCase(userId: string, productIds: number[]) {
  if (productIds.length > 0) {
    try {
      await insertFavorites(userId, productIds);
    } catch (error) {
      throw toFavoriteError(error);
    }
  }

  return getFavoritesUseCase(userId);
}
