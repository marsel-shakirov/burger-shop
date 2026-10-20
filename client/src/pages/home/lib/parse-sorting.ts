import { PRODUCT_SORT_BY, PRODUCT_SORT_ORDER, type ProductSorting } from '@/entities/product';
import { isOneOf } from '@/shared/lib';

import { DEFAULT_SORTING, SORT_OPTIONS } from '../config/catalog.constants';
import { isSameSorting } from './is-same-sorting';

export const parseSorting = (searchParams: URLSearchParams): ProductSorting => {
  const sort = searchParams.get('sort');
  const order = searchParams.get('order');

  const sorting: ProductSorting = {
    sort: isOneOf(PRODUCT_SORT_BY, sort) ? sort : DEFAULT_SORTING.sort,
    order: isOneOf(PRODUCT_SORT_ORDER, order) ? order : DEFAULT_SORTING.order,
  };

  return SORT_OPTIONS.some((option) => isSameSorting(option, sorting)) ? sorting : DEFAULT_SORTING;
};
