import { GENDERS, type Profile } from '@/entities/profile';
import { isOneOf } from '@/shared/lib';

import type { ProfileFormError, ProfileSection, ProfileUpdate } from '../model/edit-profile.types';
import { parseBirthDate } from './birth-date';

type ReadResult = { ok: true; update: ProfileUpdate } | { ok: false; error: ProfileFormError };

const toNullable = (value: string) => value.trim() || null;

export const readProfileForm = (section: ProfileSection, formData: FormData): ReadResult => {
  const get = (name: string) => String(formData.get(name) ?? '');

  if (section === 'phone') {
    return { ok: true, update: { phone: toNullable(get('phone')) } };
  }

  const birthDate = parseBirthDate(get('birthDay'), get('birthMonth'), get('birthYear'));

  if (!birthDate.ok) {
    return { ok: false, error: { message: birthDate.error, field: 'birthDate' } };
  }

  const gender = get('gender');

  return {
    ok: true,
    update: {
      name: toNullable(get('name')),
      birthDate: birthDate.value,
      gender: isOneOf(GENDERS, gender) ? gender : null,
    },
  };
};

export const getChangedFields = (profile: Profile, update: ProfileUpdate): ProfileUpdate =>
  Object.fromEntries(
    Object.entries(update).filter(([key, value]) => profile[key as keyof Profile] !== value),
  );
