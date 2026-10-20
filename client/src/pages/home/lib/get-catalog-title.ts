import type { Category, Menu } from '@/entities/menu';

interface CatalogTitleParams {
  menu?: Menu;
  category?: Category;
}

export const getCatalogTitle = ({ menu, category }: CatalogTitleParams) =>
  category?.name ?? (menu ? `Все ${menu.name.toLowerCase()}` : 'Все');
