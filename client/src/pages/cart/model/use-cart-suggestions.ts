import { useQuery } from '@tanstack/react-query';

import { ALL_PRODUCTS_PARAMS, productsQueryOptions } from '@/entities/product';

import { getCategoryLeaders } from '../lib/get-category-leaders';

const SUGGESTIONS_COUNT = 4;

export const useCartSuggestions = () => {
  const { data: products = [] } = useQuery(productsQueryOptions(ALL_PRODUCTS_PARAMS));

  return getCategoryLeaders(products, SUGGESTIONS_COUNT);
};
