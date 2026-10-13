import { authFetch, createApiError, type RequestOptions } from '@/shared/api';

import type { CartEntry } from '../model/cart.types';
import type { CartResponse } from './cart.types';

export const getCart = async ({ signal }: RequestOptions = {}): Promise<CartEntry[]> => {
  const response = await authFetch('/api/cart', { signal });

  if (!response.ok) {
    throw await createApiError(response);
  }

  const { items }: CartResponse = await response.json();

  return items;
};
