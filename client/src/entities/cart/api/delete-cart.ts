import { authFetch, createApiError } from '@/shared/api';

export const deleteCart = async (): Promise<void> => {
  const response = await authFetch('/api/cart', { method: 'DELETE' });

  if (!response.ok) {
    throw await createApiError(response);
  }
};
