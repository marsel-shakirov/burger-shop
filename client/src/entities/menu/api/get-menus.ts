import { createApiError, readJson, type RequestOptions } from '@/shared/api';

import type { Menu } from '../model/menu.types';

export const getMenus = async ({ signal }: RequestOptions = {}): Promise<Menu[]> => {
  const response = await fetch(`/api/menu`, { signal });

  if (!response.ok) {
    throw await createApiError(response);
  }

  return readJson<Menu[]>(response);
};
