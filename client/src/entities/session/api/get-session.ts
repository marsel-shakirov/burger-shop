import { createApiError, readJson, type RequestOptions } from '@/shared/api';

import type { SessionUser } from '../model/session.types';

export const getSession = async ({ signal }: RequestOptions = {}): Promise<SessionUser | null> => {
  const response = await fetch('/api/auth/session', { signal });

  if (!response.ok) {
    throw await createApiError(response);
  }

  const { user } = await readJson<{ user: SessionUser | null }>(response);

  return user;
};
