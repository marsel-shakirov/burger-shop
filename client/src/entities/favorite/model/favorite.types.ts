export type FavoriteProductId = number;

export interface FavoriteState {
  productIds: FavoriteProductId[];
  toggleFavorite: (productId: FavoriteProductId) => void;
  removeFavorite: (productId: FavoriteProductId) => void;
  clearFavorites: () => void;
}
