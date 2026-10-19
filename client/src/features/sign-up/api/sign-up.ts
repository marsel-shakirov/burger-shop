import type { AuthCredentials, SessionUser } from '@/entities/session';
import { createApiError, readJson } from '@/shared/api';

export const signUp = async (credentials: AuthCredentials): Promise<SessionUser | null> => {
  const response = await fetch('/api/auth/sign-up', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw await createApiError(response);
  }

  const { user } = await readJson<{ user: SessionUser | null }>(response);

  return user;
};
