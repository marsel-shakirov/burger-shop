import type { Product, ProductsQueryParams } from '../model/product.types';

export const getProducts = async (
  { menu, sorting, category }: ProductsQueryParams,
  signal: AbortSignal,
): Promise<Product[]> => {
  const params = new URLSearchParams({ sort: sorting.sort, order: sorting.order });

  if (category) {
    params.set('category', category);
  }

  params.set('menu', menu);

  const response = await fetch(`api/products?${params}`, { signal });

  if (!response.ok) {
    throw new Error('Failed to load products');
  }

  return response.json();
};
