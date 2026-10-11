import type { Profile } from '@/entities/profile';
import { authFetch, createApiError } from '@/shared/api';

import type { ProfileUpdate } from '../model/edit-profile.types';

export const updateProfile = async (data: ProfileUpdate): Promise<Profile> => {
  const response = await authFetch('/api/profile', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw await createApiError(response);
  }

  return response.json();
};
