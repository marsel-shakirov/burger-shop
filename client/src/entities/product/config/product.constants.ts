import type { OpenedFromListState, ProductsQueryParams } from '../model/product.types';

export const PRODUCT_UNIT_LABEL = { g: 'г', ml: 'мл' } as const;

export const OPENED_FROM_LIST_STATE: OpenedFromListState = { openedFromList: true };

export const ALL_PRODUCTS_PARAMS: ProductsQueryParams = {
  sorting: { sort: 'popularity', order: 'asc' },
};
