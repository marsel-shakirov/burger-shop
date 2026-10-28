import { createApiError, readJson, type RequestOptions } from '@/shared/api';

import type { Promo } from '../model/promo.types';

export const getPromos = async ({ signal }: RequestOptions = {}): Promise<Promo[]> => {
  const response = await fetch(`/api/promos`, { signal });

  if (!response.ok) {
    throw await createApiError(response);
  }

  return readJson<Promo[]>(response);
};
