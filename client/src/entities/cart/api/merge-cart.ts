import { authFetch, createApiError, readJson } from '@/shared/api';

import type { CartEntry } from '../model/cart.types';
import type { CartResponse } from './cart.types';

export const mergeCart = async (items: CartEntry[]): Promise<CartEntry[]> => {
  const response = await authFetch('/api/cart/merge', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  });

  if (!response.ok) {
    throw await createApiError(response);
  }

  const { items: mergedItems } = await readJson<CartResponse>(response);

  return mergedItems;
};
