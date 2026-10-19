import { useQuery } from '@tanstack/react-query';

import { type ProductSorting, productsQueryOptions } from '@/entities/product';

import { keepPreviousIfSameFilter } from './keep-previous-if-same-filter';

interface CatalogProductsParams {
  menuSlug: string;
  categorySlug?: string;
  sorting: ProductSorting;
  isMenusSettled: boolean;
}

export const useCatalogProducts = ({
  menuSlug,
  categorySlug,
  sorting,
  isMenusSettled,
}: CatalogProductsParams) =>
  useQuery({
    ...productsQueryOptions({ sorting, menu: menuSlug, category: categorySlug }),
    enabled: isMenusSettled,
    placeholderData: keepPreviousIfSameFilter({ menu: menuSlug, category: categorySlug }),
  });
