import { useQuery } from '@tanstack/react-query';

import { productsQueryOptions } from '../api/products-query-options';
import { ALL_PRODUCTS_PARAMS } from '../config/product.constants';
import type { Product } from './product.types';

const toProductsById = (products: Product[]) =>
  new Map(products.map((product) => [product.id, product]));

export const useProductsById = () =>
  useQuery({
    ...productsQueryOptions(ALL_PRODUCTS_PARAMS),
    select: toProductsById,
  });
