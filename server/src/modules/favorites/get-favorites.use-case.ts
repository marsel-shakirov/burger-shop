import { toFavoritesResponse } from './favorites.mapper.ts';
import { findFavorites } from './favorites.repository.ts';

export async function getFavoritesUseCase(userId: string) {
  return toFavoritesResponse(await findFavorites(userId));
}
