import { useQuery } from '@tanstack/react-query';

import { ALL_PRODUCTS_PARAMS, productsQueryOptions } from '@/entities/product';

export const useCatalogProducts = () => useQuery(productsQueryOptions(ALL_PRODUCTS_PARAMS));
