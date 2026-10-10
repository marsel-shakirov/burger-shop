import type { FavoriteRow } from './favorites.types.ts';

export interface FavoritesResponse {
  productIds: number[];
}

export function toFavoritesResponse(rows: FavoriteRow[]): FavoritesResponse {
  return { productIds: rows.map((row) => row.product_id) };
}
