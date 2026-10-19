import { useSuspenseQuery } from '@tanstack/react-query';

import { type Category, CategoryFilter, menusQueryOptions, MenuTabs } from '@/entities/menu';

import { ALL_CATEGORY } from '../config/catalog.constants';
import { useCatalogSelection } from '../model/use-catalog-selection';
import { CatalogFiltersLayout } from './catalog-filters-layout';

interface CatalogFiltersContentProps {
  onSelectionChange: () => void;
}

export const CatalogFiltersContent = ({ onSelectionChange }: CatalogFiltersContentProps) => {
  const { data: menus } = useSuspenseQuery(menusQueryOptions());
  const {
    menu,
    menuSlug,
    categorySlug = ALL_CATEGORY.slug,
    selectMenu,
    selectCategory,
  } = useCatalogSelection();

  const categoryOptions: Category[] = [ALL_CATEGORY, ...(menu?.categories ?? [])];

  return (
    <CatalogFiltersLayout
      menuTabs={
        <MenuTabs
          menus={menus}
          selectedMenuSlug={menuSlug}
          onChange={(slug) => {
            selectMenu(slug);
            onSelectionChange();
          }}
        />
      }
      categoryFilter={
        <CategoryFilter
          key={menuSlug}
          categories={categoryOptions}
          selectedCategorySlug={categorySlug}
          onChange={(slug) => {
            selectCategory(slug);
            onSelectionChange();
          }}
        />
      }
    />
  );
};
