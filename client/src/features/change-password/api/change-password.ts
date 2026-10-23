import { authFetch, createApiError } from '@/shared/api';

import type { PasswordChange } from '../model/change-password.types';

export const changePassword = async (change: PasswordChange): Promise<void> => {
  const response = await authFetch('/api/auth/password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(change),
  });

  if (!response.ok) {
    throw await createApiError(response);
  }
};
