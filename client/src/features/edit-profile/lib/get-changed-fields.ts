import type { Profile } from '@/entities/profile';

import type { ProfileUpdate } from '../model/edit-profile.types';

export const getChangedFields = (profile: Profile, update: ProfileUpdate): ProfileUpdate =>
  Object.fromEntries(
    Object.entries(update).filter(([key, value]) => profile[key as keyof Profile] !== value),
  );
