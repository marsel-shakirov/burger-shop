import { BadRequest } from '../../errors/bad-request.error.ts';
import { SupabaseAuthError } from '../../errors/supabase-auth.error.ts';
import type { StatelessSupabase } from '../../supabase.ts';

export async function verifyPassword(verifier: StatelessSupabase, email: string, password: string) {
  const { error } = await verifier.auth.signInWithPassword({ email, password });

  if (error?.code === 'invalid_credentials') {
    throw new BadRequest('Invalid current password', 'invalid_current_password');
  }

  if (error) throw new SupabaseAuthError(error);

  await verifier.auth.signOut({ scope: 'local' });
}
