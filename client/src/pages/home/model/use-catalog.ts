import { useQuery } from '@tanstack/react-query';

import { menusQueryOptions } from '@/entities/menu';
import { ALL_PRODUCTS_PARAMS, productsQueryOptions } from '@/entities/product';

import { groupProductsByCatalog } from '../lib/group-products-by-catalog';

export const useCatalog = () => {
  const menus = useQuery(menusQueryOptions());
  const products = useQuery(productsQueryOptions(ALL_PRODUCTS_PARAMS));

  const groups =
    menus.data && products.data ? groupProductsByCatalog(menus.data, products.data) : undefined;

  return { menus, products, groups };
};

export type CatalogData = ReturnType<typeof useCatalog>;
