import type { ProfileRow } from './profile.types.ts';

export type ProfileResponse = Omit<ProfileRow, 'id'>;

export function toProfileResponse({ name, phone }: ProfileRow): ProfileResponse {
  return { name, phone };
}
