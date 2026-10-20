import type { ProductSorting } from '@/entities/product';

export interface SortOption extends ProductSorting {
  label: string;
}
