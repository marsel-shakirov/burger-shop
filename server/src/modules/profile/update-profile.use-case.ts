import { Unauthorized } from '../../errors/unauthorized.error.ts';
import { toProfileResponse } from './profile.mapper.ts';
import { upsertProfile } from './profile.repository.ts';
import type { ProfileInput } from './profile.types.ts';

export async function updateProfileUseCase(userId: string, input: ProfileInput) {
  const row = await upsertProfile(userId, input);
  if (!row) throw new Unauthorized();
  return toProfileResponse(row);
}
