export type FavoriteProductId = number;

export interface FavoriteState {
  productIds: FavoriteProductId[];
  toggleFavorite: (productId: FavoriteProductId) => void;
  removeFavorite: (productId: FavoriteProductId) => void;
  clearFavorites: () => void;
}

export type FavoriteAction = 'add' | 'remove';

export interface FavoriteChange {
  productId: FavoriteProductId;
  action: FavoriteAction;
}
