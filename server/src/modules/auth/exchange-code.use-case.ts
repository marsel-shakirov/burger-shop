import type { Supabase } from '../../supabase.ts';

export async function exchangeCodeUseCase(supabase: Supabase, code: string) {
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  return !error;
}
