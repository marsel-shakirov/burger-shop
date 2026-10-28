import { type QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';

import { PRODUCTS_QUERY_KEY, productsQueryOptions } from '../api/products-query-options';
import { ALL_PRODUCTS_PARAMS } from '../config/product.constants';
import type { Product } from './product.types';

const getProductsFromLoadedCatalogs = (queryClient: QueryClient) =>
  queryClient
    .getQueriesData<Product[]>({ queryKey: PRODUCTS_QUERY_KEY })
    .flatMap(([, products]) => products ?? []);

export const useProduct = (productId: number | undefined) => {
  const queryClient = useQueryClient();

  return useQuery({
    ...productsQueryOptions(ALL_PRODUCTS_PARAMS),
    enabled: productId !== undefined,
    select: (products) => products.find((product) => product.id === productId),
    placeholderData: () => getProductsFromLoadedCatalogs(queryClient),
  });
};
