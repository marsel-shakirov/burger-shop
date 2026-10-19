import { useSuspenseQuery } from '@tanstack/react-query';

import { type Category, CategoryFilter, menusQueryOptions, MenuTabs } from '@/entities/menu';

import { ALL_CATEGORY } from '../model/catalog.constants';
import { CatalogFiltersLayout } from './catalog-filters-layout';

interface CatalogFiltersContentProps {
  menuSlug: string;
  categorySlug: string;
  onMenuChange: (slug: string) => void;
  onCategoryChange: (slug: string) => void;
}

export const CatalogFiltersContent = ({
  menuSlug,
  categorySlug,
  onMenuChange,
  onCategoryChange,
}: CatalogFiltersContentProps) => {
  const { data: menus } = useSuspenseQuery(menusQueryOptions());

  const categories = menus.find((menu) => menu.slug === menuSlug)?.categories ?? [];
  const categoryOptions: Category[] = [ALL_CATEGORY, ...categories];

  return (
    <CatalogFiltersLayout
      menuTabs={<MenuTabs menus={menus} selectedMenuSlug={menuSlug} onChange={onMenuChange} />}
      categoryFilter={
        <CategoryFilter
          key={menuSlug}
          categories={categoryOptions}
          selectedCategorySlug={categorySlug}
          onChange={onCategoryChange}
        />
      }
    />
  );
};
