import type { FavoriteState } from './favorite.types';

export const selectFavoriteIds = (state: FavoriteState) => state.productIds;
