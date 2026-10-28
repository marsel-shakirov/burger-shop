import {
  clearCatalogParams,
  parseCatalogParams,
  setCatalogCategoryParam,
  setCatalogMenuParam,
} from '@/entities/menu';
import { useUpdateSearchParams } from '@/shared/lib';

import type { CatalogSection } from './catalog.types';

export const useCatalogParams = () => {
  const [searchParams, updateParams] = useUpdateSearchParams();

  const { menuSlug, categorySlug } = parseCatalogParams(searchParams);

  const selectMenu = (slug: string) => updateParams((next) => setCatalogMenuParam(next, slug));

  const selectCategory = (section: CatalogSection) =>
    updateParams((next) => {
      setCatalogMenuParam(next, section.menuSlug);
      setCatalogCategoryParam(next, section.categorySlug);
    });

  const clearSelection = () => updateParams(clearCatalogParams);

  return { menuSlug, categorySlug, selectMenu, selectCategory, clearSelection };
};
