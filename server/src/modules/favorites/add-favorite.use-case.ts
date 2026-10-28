import { toProductReferenceError } from '../../lib/foreign-key-error.ts';
import { FAVORITES_PRODUCT_FK } from './favorites.constants.ts';
import { insertFavorite } from './favorites.repository.ts';

export async function addFavoriteUseCase(userId: string, productId: number) {
  try {
    await insertFavorite(userId, productId);
  } catch (error) {
    throw toProductReferenceError(error, FAVORITES_PRODUCT_FK);
  }
}
