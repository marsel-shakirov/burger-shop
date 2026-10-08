import type { Supabase } from '../../supabase.ts';
import { toSessionUser } from './auth.mapper.ts';

export async function getSessionUseCase(supabase: Supabase) {
  const { data } = await supabase.auth.getClaims();

  if (!data) return null;

  return toSessionUser({ id: data.claims.sub, email: data.claims.email });
}
