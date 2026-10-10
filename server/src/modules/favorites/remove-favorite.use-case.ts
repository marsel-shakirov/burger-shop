import { deleteFavorite } from './favorites.repository.ts';

export async function removeFavoriteUseCase(userId: string, productId: number) {
  await deleteFavorite(userId, productId);
}
