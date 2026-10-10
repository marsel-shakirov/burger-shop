import { toFavoriteError } from './favorites.errors.ts';
import { insertFavorite } from './favorites.repository.ts';

export async function addFavoriteUseCase(userId: string, productId: number) {
  try {
    await insertFavorite(userId, productId);
  } catch (error) {
    throw toFavoriteError(error);
  }
}
