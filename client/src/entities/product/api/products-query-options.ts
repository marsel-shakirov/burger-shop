import { queryOptions } from '@tanstack/react-query';

import { createApiError, readJson, type RequestOptions } from '@/shared/api';

import type { Product, ProductsQueryParams } from '../model/product.types';

const PRODUCTS_STALE_TIME_MS = 1000 * 60 * 60;

const getProducts = async (
  { menu, sorting, category }: ProductsQueryParams,
  { signal }: RequestOptions = {},
): Promise<Product[]> => {
  const params = new URLSearchParams({ sort: sorting.sort, order: sorting.order });

  if (menu) {
    params.set('menu', menu);
  }

  if (category) {
    params.set('category', category);
  }

  const response = await fetch(`/api/products?${params}`, { signal });

  if (!response.ok) {
    throw await createApiError(response);
  }

  return readJson<Product[]>(response);
};

export const PRODUCTS_QUERY_KEY = ['products'] as const;

export const productsQueryOptions = (params: ProductsQueryParams) =>
  queryOptions({
    queryKey: [...PRODUCTS_QUERY_KEY, params],
    queryFn: ({ signal }) => getProducts(params, { signal }),
    staleTime: PRODUCTS_STALE_TIME_MS,
  });
