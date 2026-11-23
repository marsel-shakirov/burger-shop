import { queryOptions } from '@tanstack/react-query';

import { createApiError, readJson, type RequestOptions } from '@/shared/api';

import type { Menu } from '../model/menu.types';

const MENU_STALE_TIME_MS = 1000 * 60 * 60;

const getMenus = async ({ signal }: RequestOptions = {}): Promise<Menu[]> => {
  const response = await fetch(`/api/menu`, { signal });

  if (!response.ok) {
    throw await createApiError(response);
  }

  return readJson<Menu[]>(response);
};

export const menusQueryOptions = () =>
  queryOptions({
    queryKey: ['menus'],
    queryFn: ({ signal }) => getMenus({ signal }),
    staleTime: MENU_STALE_TIME_MS,
  });
