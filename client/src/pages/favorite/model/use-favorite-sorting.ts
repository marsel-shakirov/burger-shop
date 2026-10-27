import { useUpdateSearchParams } from '@/shared/lib';

import { parseSorting } from '../lib/parse-sorting';
import type { FavoriteSorting } from './favorite-sorting.types';

export const useFavoriteSorting = () => {
  const [searchParams, updateParams] = useUpdateSearchParams();

  const sorting = parseSorting(searchParams);

  const changeSorting = ({ sort, order }: FavoriteSorting) =>
    updateParams((next) => {
      next.set('sort', sort);
      next.set('order', order);
    });

  return { sorting, changeSorting };
};
