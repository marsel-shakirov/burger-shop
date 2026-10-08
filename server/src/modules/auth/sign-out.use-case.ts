import { SupabaseAuthError } from '../../errors/supabase-auth.error.ts';
import type { Supabase } from '../../supabase.ts';

export async function signOutUseCase(supabase: Supabase) {
  const { error } = await supabase.auth.signOut();

  if (error) throw new SupabaseAuthError(error);
}
