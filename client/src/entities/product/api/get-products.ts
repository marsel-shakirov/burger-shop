import type { Product, ProductsQuery } from '../model/product.types';

type GetProductsParams = ProductsQuery & {
  signal: AbortSignal;
};

export const getProducts = async ({
  categoryId,
  sortBy,
  orderBy,
  signal,
}: GetProductsParams): Promise<Product[]> => {
  const params = new URLSearchParams();

  if (categoryId) {
    params.set('categoryId', categoryId);
  }

  params.set('sortBy', sortBy);
  params.set('order', orderBy);
  
  const response = await fetch(`/api/products?${params.toString()}`, { signal });

  if (!response.ok) {
    throw new Error('Failed to load products');
  }

  return response.json();
};
