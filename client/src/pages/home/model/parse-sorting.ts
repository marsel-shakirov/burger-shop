import { PRODUCT_SORT_BY, PRODUCT_SORT_ORDER, type ProductSorting } from '@/entities/product';
import { isOneOf } from '@/shared/lib/is-one-of';

const DEFAULT_SORTING: ProductSorting = { sort: 'rating', order: 'desc' };

export const parseSorting = (searchParams: URLSearchParams): ProductSorting => {
  const sort = searchParams.get('sort');
  const order = searchParams.get('order');

  return {
    sort: isOneOf(PRODUCT_SORT_BY, sort) ? sort : DEFAULT_SORTING.sort,
    order: isOneOf(PRODUCT_SORT_ORDER, order) ? order : DEFAULT_SORTING.order,
  };
};
