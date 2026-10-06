import type { Profile } from '@/entities/profile';
import { authFetch } from '@/shared/api';

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
    throw new Error('Failed to update profile');
  }

  return response.json();
};
