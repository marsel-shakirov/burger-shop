import { authFetch, createApiError } from '@/shared/api';

import type { CartEntry } from '../model/cart.types';

export const updateCartItem = async ({ productId, quantity }: CartEntry): Promise<void> => {
  const response = await authFetch(`/api/cart/${productId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity }),
  });

  if (!response.ok) {
    throw await createApiError(response);
  }
};
