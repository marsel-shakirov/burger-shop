import { Unauthorized } from '../../errors/unauthorized.error.ts';
import { toProfileResponse } from './profile.mapper.ts';
import { findProfile } from './profile.repository.ts';

export async function getProfileUseCase(userId: string) {
  const row = await findProfile(userId);
  if (!row) throw new Unauthorized();
  return toProfileResponse(row);
}
