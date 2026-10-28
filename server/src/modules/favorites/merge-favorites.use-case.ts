import { toProductReferenceError } from '../../lib/foreign-key-error.ts';
import { FAVORITES_PRODUCT_FK } from './favorites.constants.ts';
import { insertFavorites } from './favorites.repository.ts';
import { getFavoritesUseCase } from './get-favorites.use-case.ts';

export async function mergeFavoritesUseCase(userId: string, productIds: number[]) {
  if (productIds.length > 0) {
    try {
      await insertFavorites(userId, productIds);
    } catch (error) {
      throw toProductReferenceError(error, FAVORITES_PRODUCT_FK);
    }
  }

  return getFavoritesUseCase(userId);
}
