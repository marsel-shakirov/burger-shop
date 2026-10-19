import { useSuspenseQuery } from '@tanstack/react-query';

import { CategoryFilter, menusQueryOptions, MenuTabs } from '@/entities/menu';

import { useCatalogSelection } from '../model/use-catalog-selection';
import { CatalogFiltersLayout } from './catalog-filters-layout';

interface CatalogFiltersContentProps {
  onSelectionChange: () => void;
}

export const CatalogFiltersContent = ({ onSelectionChange }: CatalogFiltersContentProps) => {
  const { data: menus } = useSuspenseQuery(menusQueryOptions());
  const { menu, menuSlug, categorySlug, selectMenu, selectCategory } = useCatalogSelection();

  const withSelectionChange =
    <T,>(select: (slug: T) => void) =>
    (slug: T) => {
      select(slug);
      onSelectionChange();
    };

  return (
    <CatalogFiltersLayout
      menuTabs={
        <MenuTabs
          menus={menus}
          selectedMenuSlug={menuSlug}
          onChange={withSelectionChange(selectMenu)}
        />
      }
      categoryFilter={
        <CategoryFilter
          key={menuSlug}
          categories={menu?.categories ?? []}
          selectedCategorySlug={categorySlug}
          onChange={withSelectionChange(selectCategory)}
        />
      }
    />
  );
};
