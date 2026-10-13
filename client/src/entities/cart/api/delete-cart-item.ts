import { authFetch, createApiError } from '@/shared/api';

import type { CartItemPayload } from '../model/cart.types';

export const deleteCartItem = async (productId: CartItemPayload): Promise<void> => {
  const response = await authFetch(`/api/cart/${productId}`, { method: 'DELETE' });

  if (!response.ok) {
    throw await createApiError(response);
  }
};
