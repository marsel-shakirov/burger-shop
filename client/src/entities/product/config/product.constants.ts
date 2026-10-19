import type { ProductsQueryParams } from '../model/product.types';

export const PRODUCT_UNIT_LABEL = { g: 'г', ml: 'мл' } as const;

export const ALL_PRODUCTS_PARAMS: ProductsQueryParams = {
  sorting: { sort: 'popularity', order: 'asc' },
};
