import type { SessionUser } from '@/entities/session';
import { createApiError } from '@/shared/api';

import type { SignUpCredentials } from '../model/sign-up.types';

export const signUp = async (credentials: SignUpCredentials): Promise<SessionUser | null> => {
  const response = await fetch('/api/auth/sign-up', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw await createApiError(response);
  }

  const { user } = await response.json();

  return user;
};
