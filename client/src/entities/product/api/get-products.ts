import type { Product } from '../model/product.types';

type GetProductsParams = {
  categoryId?: string;
  signal: AbortSignal;
};

export const getProducts = async ({
  categoryId,
  signal,
}: GetProductsParams): Promise<Product[]> => {
  const params = new URLSearchParams();

  if (categoryId) {
    params.set('categoryId', categoryId);
  }

  const query = params.size > 0 ? `?${params}` : '';
  const response = await fetch(`/api/products${query}`, { signal });

  if (!response.ok) {
    throw new Error('Failed to load products');
  }

  return response.json();
};
