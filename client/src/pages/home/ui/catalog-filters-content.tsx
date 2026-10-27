import { CategoryFilter, MenuTabs } from '@/entities/menu';

import type { CatalogMenuGroup, CatalogSection } from '../model/catalog.types';
import { CatalogFiltersLayout } from './catalog-filters-layout';

interface CatalogFiltersContentProps {
  groups: CatalogMenuGroup[];
  activeSection: CatalogSection;
  onMenuSelect: (menuSlug: string) => void;
  onCategorySelect: (section: CatalogSection) => void;
}

export const CatalogFiltersContent = ({
  groups,
  activeSection: { menuSlug, categorySlug },
  onMenuSelect,
  onCategorySelect,
}: CatalogFiltersContentProps) => {
  const activeGroup = groups.find(({ menu }) => menu.slug === menuSlug);

  return (
    <CatalogFiltersLayout
      menuTabs={
        <MenuTabs
          menus={groups.map(({ menu }) => menu)}
          selectedMenuSlug={menuSlug}
          onChange={onMenuSelect}
        />
      }
      categoryFilter={
        <CategoryFilter
          key={menuSlug}
          categories={activeGroup?.categories.map(({ category }) => category) ?? []}
          selectedCategorySlug={categorySlug}
          onChange={(slug) => onCategorySelect({ menuSlug, categorySlug: slug })}
        />
      }
    />
  );
};
