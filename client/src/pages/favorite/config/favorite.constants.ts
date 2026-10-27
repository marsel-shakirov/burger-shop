import { PRODUCT_SORT_BY } from '@/entities/product';

import type { FavoriteSorting, SortOption } from '../model/favorite-sorting.types';

export const FAVORITE_SORT_BY = ['added', ...PRODUCT_SORT_BY] as const;

export const DEFAULT_FAVORITE_SORTING: FavoriteSorting = { sort: 'added', order: 'desc' };

export const FAVORITE_SORT_OPTIONS: SortOption[] = [
  { sort: 'added', order: 'desc', label: 'Сначала недавно добавленные' },
  { sort: 'popularity', order: 'desc', label: 'Сначала популярные' },
  { sort: 'rating', order: 'desc', label: 'Сначала с высоким рейтингом' },
  { sort: 'price', order: 'asc', label: 'Сначала дешёвые' },
  { sort: 'price', order: 'desc', label: 'Сначала дорогие' },
];
