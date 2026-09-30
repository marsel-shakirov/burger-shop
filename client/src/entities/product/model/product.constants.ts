import type { ProductsQueryParams } from './product.types';

export const PRODUCT_SORT_BY = ['popularity', 'price', 'rating'] as const;
export const PRODUCT_SORT_ORDER = ['desc', 'asc'] as const;
export const PRODUCT_UNIT = ['g', 'ml'] as const;
export const PRODUCT_UNIT_LABEL = { g: 'г', ml: 'мл' } as const;

export const ALL_PRODUCTS_PARAMS: ProductsQueryParams = {
  sorting: { sort: 'popularity', order: 'asc' },
};
