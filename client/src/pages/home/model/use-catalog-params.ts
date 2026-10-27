import { parseCatalogParams, setCatalogCategoryParam, setCatalogMenuParam } from '@/entities/menu';
import { useUpdateSearchParams } from '@/shared/lib';

import { DEFAULT_MENU_SLUG } from '../config/catalog.constants';

export const useCatalogParams = () => {
  const [searchParams, updateParams] = useUpdateSearchParams();

  const { menuSlug = DEFAULT_MENU_SLUG, categorySlug } = parseCatalogParams(searchParams);

  const selectMenu = (slug: string) => updateParams((next) => setCatalogMenuParam(next, slug));

  const selectCategory = (slug?: string) =>
    updateParams((next) => setCatalogCategoryParam(next, slug));

  return { menuSlug, categorySlug, selectMenu, selectCategory };
};
