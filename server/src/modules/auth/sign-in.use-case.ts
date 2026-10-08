import { SupabaseAuthError } from '../../errors/supabase-auth.error.ts';
import type { Supabase } from '../../supabase.ts';
import { toSessionUser } from './auth.mapper.ts';
import type { Credentials } from './auth.schema.ts';

export async function signInUseCase(supabase: Supabase, { email, password }: Credentials) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) throw new SupabaseAuthError(error);

  return toSessionUser(data.user);
}
