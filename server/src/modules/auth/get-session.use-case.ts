import { Unauthorized } from '../../errors/unauthorized.error.ts';
import type { Supabase } from '../../supabase.ts';
import { toSessionUser } from './auth.mapper.ts';

export async function getSessionUseCase(supabase: Supabase) {
  const { data } = await supabase.auth.getClaims();

  if (!data) throw new Unauthorized();

  return toSessionUser({ id: data.claims.sub, email: data.claims.email });
}
