import { useQuery } from '@tanstack/react-query';

import { ALL_PRODUCTS_PARAMS, type Product, productsQueryOptions } from '@/entities/product';

const SUGGESTIONS_COUNT = 4;

export const useCartSuggestions = () => {
  const { data: products = [] } = useQuery(productsQueryOptions(ALL_PRODUCTS_PARAMS));
  const leadersByCategory = new Map<number, Product>();

  for (const product of products.toSorted((a, b) => b.popularity - a.popularity)) {
    if (!leadersByCategory.has(product.category_id)) {
      leadersByCategory.set(product.category_id, product);
    }
  }

  return [...leadersByCategory.values()].slice(0, SUGGESTIONS_COUNT);
};
