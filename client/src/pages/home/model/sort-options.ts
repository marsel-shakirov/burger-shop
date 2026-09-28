import type { ProductSorting } from '@/entities/product';

export interface SortOption extends ProductSorting {
  label: string;
}

export const SORT_OPTIONS: SortOption[] = [
  { sort: 'popularity', order: 'desc', label: 'Сначала популярные' },
  { sort: 'rating', order: 'desc', label: 'Сначала с высоким рейтингом' },
  { sort: 'price', order: 'asc', label: 'Сначала дешёвые' },
  { sort: 'price', order: 'desc', label: 'Сначала дорогие' },
];

export const isSameSorting = (a: ProductSorting, b: ProductSorting) =>
  a.sort === b.sort && a.order === b.order;
