import type { AuthCredentials, SessionUser } from '@/entities/session';
import { createApiError, readJson } from '@/shared/api';

export const signIn = async (credentials: AuthCredentials): Promise<SessionUser> => {
  const response = await fetch('/api/auth/sign-in', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw await createApiError(response);
  }

  const { user } = await readJson<{ user: SessionUser }>(response);

  return user;
};
