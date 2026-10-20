import type { ProductSorting } from '@/entities/product';

export const isSameSorting = (a: ProductSorting, b: ProductSorting) =>
  a.sort === b.sort && a.order === b.order;
