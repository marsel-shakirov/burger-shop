import type { SessionUser } from '@/entities/session';
import { createApiError } from '@/shared/api';

import type { SignInCredentials } from '../model/sign-in.types';

export const signIn = async (credentials: SignInCredentials): Promise<SessionUser> => {
  const response = await fetch('/api/auth/sign-in', {
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
