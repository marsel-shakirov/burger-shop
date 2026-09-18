import { queryOptions } from '@tanstack/react-query';

import type { ProductsQueryParams } from '../model/product.types';
import { getProducts } from './get-products';

const PRODUCTS_STALE_TIME_MS = 1000 * 60 * 5;

export const productsQueryOptions = (params: ProductsQueryParams) =>
  queryOptions({
    queryKey: ['products', params],
    queryFn: ({ signal }) => getProducts(params, { signal }),
    staleTime: PRODUCTS_STALE_TIME_MS,
  });
