import { useQuery } from '@tanstack/react-query';

import { ALL_PRODUCTS_PARAMS } from '../model/product.constants';
import type { Product } from '../model/product.types';
import { productsQueryOptions } from './products-query-options';

const toProductsById = (products: Product[]) =>
  new Map(products.map((product) => [product.id, product]));

export const useProductsById = () =>
  useQuery({
    ...productsQueryOptions(ALL_PRODUCTS_PARAMS),
    select: toProductsById,
  });
