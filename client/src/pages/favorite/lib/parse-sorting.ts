import { PRODUCT_SORT_ORDER } from '@/entities/product';
import { isOneOf } from '@/shared/lib';

import {
  DEFAULT_FAVORITE_SORTING,
  FAVORITE_SORT_BY,
  FAVORITE_SORT_OPTIONS,
} from '../config/favorite.constants';
import type { FavoriteSorting } from '../model/favorite-sorting.types';
import { isSameSorting } from './is-same-sorting';

export const parseSorting = (searchParams: URLSearchParams): FavoriteSorting => {
  const sort = searchParams.get('sort');
  const order = searchParams.get('order');

  const sorting: FavoriteSorting = {
    sort: isOneOf(FAVORITE_SORT_BY, sort) ? sort : DEFAULT_FAVORITE_SORTING.sort,
    order: isOneOf(PRODUCT_SORT_ORDER, order) ? order : DEFAULT_FAVORITE_SORTING.order,
  };

  return FAVORITE_SORT_OPTIONS.some((option) => isSameSorting(option, sorting))
    ? sorting
    : DEFAULT_FAVORITE_SORTING;
};
