import { useQuery } from '@tanstack/react-query';

import { menusQueryOptions } from '@/entities/menu';

import { resolveCatalogSelection } from '../lib/resolve-catalog-selection';
import { useCatalogParams } from './use-catalog-params';

export const useCatalogSelection = () => {
  const { menuSlug, categorySlug, ...params } = useCatalogParams();
  const { data: menus, isSuccess, isError } = useQuery(menusQueryOptions());

  return {
    ...params,
    ...resolveCatalogSelection(menus, menuSlug, categorySlug),
    isMenusSettled: isSuccess || isError,
  };
};

export type CatalogSelection = ReturnType<typeof useCatalogSelection>;
