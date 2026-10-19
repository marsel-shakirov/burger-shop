import type { Category, Menu } from '@/entities/menu';

import { DEFAULT_MENU_SLUG } from './catalog.constants';

interface CatalogSelection {
  menuSlug: string;
  categorySlug?: string;
  menu?: Menu;
  category?: Category;
}

export const resolveCatalogSelection = (
  menus: Menu[] | undefined,
  menuSlug: string,
  categorySlug?: string,
): CatalogSelection => {
  if (!menus) return { menuSlug, categorySlug };

  const menu =
    menus.find(({ slug }) => slug === menuSlug) ??
    menus.find(({ slug }) => slug === DEFAULT_MENU_SLUG) ??
    menus[0];

  if (!menu) return { menuSlug, categorySlug };

  const category = menu.categories.find(({ slug }) => slug === categorySlug);

  return { menuSlug: menu.slug, categorySlug: category?.slug, menu, category };
};
