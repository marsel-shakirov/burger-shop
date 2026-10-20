import type { ProductSorting } from '@/entities/product';

import type { SortOption } from '../model/catalog.types';

export const DEFAULT_MENU_SLUG = 'burgers';

export const DEFAULT_SORTING: ProductSorting = { sort: 'rating', order: 'desc' };

export const SORT_OPTIONS: SortOption[] = [
  { sort: 'popularity', order: 'desc', label: 'Сначала популярные' },
  { sort: 'rating', order: 'desc', label: 'Сначала с высоким рейтингом' },
  { sort: 'price', order: 'asc', label: 'Сначала дешёвые' },
  { sort: 'price', order: 'desc', label: 'Сначала дорогие' },
];
