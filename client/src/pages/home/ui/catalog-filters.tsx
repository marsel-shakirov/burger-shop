import { CategoryFilterSkeleton, MenuTabsSkeleton } from '@/entities/menu';

import type { CatalogSection } from '../model/catalog.types';
import type { CatalogData } from '../model/use-catalog';
import { CatalogFiltersContent } from './catalog-filters-content';
import { CatalogFiltersError } from './catalog-filters-error';
import { CatalogFiltersLayout } from './catalog-filters-layout';

interface CatalogFiltersProps {
  catalog: CatalogData;
  activeSection?: CatalogSection;
  onMenuSelect: (menuSlug: string) => void;
  onCategorySelect: (section: CatalogSection) => void;
}

export const CatalogFilters = ({
  catalog: { menus, products, groups },
  activeSection,
  onMenuSelect,
  onCategorySelect,
}: CatalogFiltersProps) => {
  if (menus.isError) {
    return <CatalogFiltersError error={menus.error} onRetry={() => void menus.refetch()} />;
  }

  if (menus.isPending || products.isPending) {
    return (
      <CatalogFiltersLayout
        menuTabs={<MenuTabsSkeleton />}
        categoryFilter={<CategoryFilterSkeleton />}
      />
    );
  }

  if (!groups || !activeSection) return null;

  return (
    <CatalogFiltersContent
      groups={groups}
      activeSection={activeSection}
      onMenuSelect={onMenuSelect}
      onCategorySelect={onCategorySelect}
    />
  );
};
