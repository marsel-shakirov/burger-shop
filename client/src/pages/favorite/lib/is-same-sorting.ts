import type { FavoriteSorting } from '../model/favorite-sorting.types';

export const isSameSorting = (a: FavoriteSorting, b: FavoriteSorting) =>
  a.sort === b.sort && a.order === b.order;
