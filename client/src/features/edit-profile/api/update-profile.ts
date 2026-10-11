import type { Profile } from '@/entities/profile';
import { authFetch, createApiError } from '@/shared/api';

interface UpdateProfileData {
  name: string;
  phone: string;
}

export const updateProfile = async (data: UpdateProfileData): Promise<Profile> => {
  const response = await authFetch('/api/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw await createApiError(response);
  }

  return response.json();
};
