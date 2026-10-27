import { useQuery } from '@tanstack/react-query';

import { productsQueryOptions } from '@/entities/product';

import { CATALOG_SORTING } from '../config/catalog.constants';

interface CatalogProductsParams {
  menuSlug: string;
  categorySlug?: string;
  isMenusSettled: boolean;
}

export const useCatalogProducts = ({
  menuSlug,
  categorySlug,
  isMenusSettled,
}: CatalogProductsParams) =>
  useQuery({
    ...productsQueryOptions({ sorting: CATALOG_SORTING, menu: menuSlug, category: categorySlug }),
    enabled: isMenusSettled,
  });
