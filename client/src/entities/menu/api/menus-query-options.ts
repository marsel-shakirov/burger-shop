import { queryOptions } from '@tanstack/react-query';

import { getMenus } from './get-menus';

const MENU_STALE_TIME_MS = 1000 * 60 * 60;

export const menusQueryOptions = () =>
  queryOptions({
    queryKey: ['menus'],
    queryFn: ({ signal }) => getMenus({ signal }),
    staleTime: MENU_STALE_TIME_MS,
  });
