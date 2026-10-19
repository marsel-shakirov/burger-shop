import { parseCatalogParams, setCatalogCategoryParam, setCatalogMenuParam } from '@/entities/menu';
import type { ProductSorting } from '@/entities/product';

import { ALL_CATEGORY, DEFAULT_MENU_SLUG } from '../config/catalog.constants';
import { parseSorting } from './parse-sorting';
import { useUpdateSearchParams } from './use-update-search-params';

export const useCatalogParams = () => {
  const [searchParams, updateParams] = useUpdateSearchParams();

  const { menuSlug = DEFAULT_MENU_SLUG, categorySlug } = parseCatalogParams(searchParams);
  const sorting = parseSorting(searchParams);

  const selectMenu = (slug: string) => updateParams((next) => setCatalogMenuParam(next, slug));

  const selectCategory = (slug: string) =>
    updateParams((next) =>
      setCatalogCategoryParam(next, slug === ALL_CATEGORY.slug ? undefined : slug),
    );

  const changeSorting = ({ sort, order }: ProductSorting) =>
    updateParams((next) => {
      next.set('sort', sort);
      next.set('order', order);
    });

  return { menuSlug, categorySlug, sorting, selectMenu, selectCategory, changeSorting };
};
