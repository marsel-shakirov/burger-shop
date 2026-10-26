import { authFetch, createApiError } from '@/shared/api';

import type { EmailChange } from '../model/change-email.types';

export const changeEmail = async (change: EmailChange): Promise<void> => {
  const response = await authFetch('/api/auth/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(change),
  });

  if (!response.ok) {
    throw await createApiError(response);
  }
};
