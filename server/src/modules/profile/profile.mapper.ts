import type { Gender, ProfileRow } from './profile.types.ts';

export interface ProfileResponse {
  name: string | null;
  phone: string | null;
  birthDate: string | null;
  gender: Gender | null;
}

export function toProfileResponse({
  name,
  phone,
  birth_date,
  gender,
}: ProfileRow): ProfileResponse {
  return { name, phone, birthDate: birth_date, gender };
}
