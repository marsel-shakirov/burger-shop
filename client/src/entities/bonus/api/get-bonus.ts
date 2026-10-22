import { authFetch, createApiError, readJson, type RequestOptions } from '@/shared/api';

import type { Bonus } from '../model/bonus.types';

export const getBonus = async ({ signal }: RequestOptions = {}): Promise<Bonus> => {
  const response = await authFetch('/api/bonus', { signal });

  if (!response.ok) {
    throw await createApiError(response);
  }

  return readJson<Bonus>(response);
};
