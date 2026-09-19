import type { ProductSorting } from '@/entities/product';

import { ALL_CATEGORY, DEFAULT_MENU_SLUG } from './catalog.constants';
import { parseSorting } from './parse-sorting';
import { useUpdateSearchParams } from './use-update-search-params';

export const useCatalogParams = () => {
  const [searchParams, updateParams] = useUpdateSearchParams();

  const menuSlug = searchParams.get('menu') ?? DEFAULT_MENU_SLUG;
  const categorySlug = searchParams.get('category') ?? undefined;
  const sorting = parseSorting(searchParams);

  const selectMenu = (slug: string) =>
    updateParams((next) => {
      next.set('menu', slug);
      next.delete('category');
    });

  const selectCategory = (slug: string) =>
    updateParams((next) =>
      slug === ALL_CATEGORY.slug ? next.delete('category') : next.set('category', slug),
    );

  const changeSorting = ({ sort, order }: ProductSorting) =>
    updateParams((next) => {
      next.set('sort', sort);
      next.set('order', order);
    });

  return { menuSlug, categorySlug, sorting, selectMenu, selectCategory, changeSorting };
};
