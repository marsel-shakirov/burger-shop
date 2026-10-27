import type { Product } from '@/entities/product';

import type { FavoriteSorting } from '../model/favorite-sorting.types';

export const sortProducts = (products: Product[], { sort, order }: FavoriteSorting): Product[] => {
  if (sort === 'added') return products;

  const direction = order === 'asc' ? 1 : -1;

  return products.toSorted((a, b) => (a[sort] - b[sort]) * direction);
};
