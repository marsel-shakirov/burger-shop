import type { Category, Menu } from '@/entities/menu';
import type { Product } from '@/entities/product';

export interface CatalogCategoryGroup {
  category: Category;
  products: Product[];
}

export interface CatalogMenuGroup {
  menu: Menu;
  categories: CatalogCategoryGroup[];
}

export interface CatalogSection {
  menuSlug: string;
  categorySlug: string;
}

export interface CatalogSectionPosition {
  section: CatalogSection;
  top: number;
}
