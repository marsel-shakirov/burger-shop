import type { FavoriteProductId, FavoriteState } from './favorite.types';

export const selectFavoriteIds = (state: FavoriteState) => state.productIds;

export const selectFavoritesCount = (state: FavoriteState) => state.productIds.length;

export const selectToggleFavorite = (state: FavoriteState) => state.toggleFavorite;

export const selectClearFavorites = (state: FavoriteState) => state.clearFavorites;

export const selectIsFavorite = (productId: FavoriteProductId) => (state: FavoriteState) =>
  state.productIds.includes(productId);
