import { createApiError } from '@/shared/api';

export const signOut = async (): Promise<void> => {
  const response = await fetch('/api/auth/sign-out', { method: 'POST' });

  if (!response.ok) {
    throw await createApiError(response);
  }
};
