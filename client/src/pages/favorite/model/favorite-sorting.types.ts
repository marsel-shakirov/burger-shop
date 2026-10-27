import type { ProductSortOrder } from '@/entities/product';

import type { FAVORITE_SORT_BY } from '../config/favorite.constants';

export type FavoriteSortBy = (typeof FAVORITE_SORT_BY)[number];

export interface FavoriteSorting {
  sort: FavoriteSortBy;
  order: ProductSortOrder;
}

export interface SortOption extends FavoriteSorting {
  label: string;
}
