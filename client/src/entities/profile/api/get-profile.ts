import { authFetch, createApiError, readJson, type RequestOptions } from '@/shared/api';

import type { Profile } from '../model/profile.types';

export const getProfile = async ({ signal }: RequestOptions = {}): Promise<Profile> => {
  const response = await authFetch('/api/profile', { signal });

  if (!response.ok) {
    throw await createApiError(response);
  }

  return readJson<Profile>(response);
};
