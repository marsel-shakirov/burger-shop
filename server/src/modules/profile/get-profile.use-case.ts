import { EMPTY_PROFILE } from './profile.constants.ts';
import { toProfileResponse } from './profile.mapper.ts';
import { findProfile } from './profile.repository.ts';

export async function getProfileUseCase(userId: string) {
  const row = await findProfile(userId);
  return row ? toProfileResponse(row) : EMPTY_PROFILE;
}
