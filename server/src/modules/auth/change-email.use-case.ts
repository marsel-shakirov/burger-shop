import { BadRequest } from '../../errors/bad-request.error.ts';
import { SupabaseAuthError } from '../../errors/supabase-auth.error.ts';
import { Unauthorized } from '../../errors/unauthorized.error.ts';
import type { StatelessSupabase, Supabase } from '../../supabase.ts';
import { EMAIL_CHANGE_CALLBACK_URL } from './auth.constants.ts';
import type { EmailChange } from './auth.schema.ts';
import { verifyPassword } from './verify-password.ts';

export async function changeEmailUseCase(
  supabase: Supabase,
  verifier: StatelessSupabase,
  { newEmail, currentPassword }: EmailChange,
) {
  const { data } = await supabase.auth.getClaims();

  if (!data) throw new Unauthorized();

  const { email } = data.claims;

  if (!email) {
    throw new BadRequest('Password sign-in is not available', 'email_provider_disabled');
  }

  if (newEmail.toLowerCase() === email.toLowerCase()) {
    throw new BadRequest('New email must differ from the current one', 'same_email');
  }

  await verifyPassword(verifier, email, currentPassword);

  const { error } = await supabase.auth.updateUser(
    { email: newEmail },
    { emailRedirectTo: EMAIL_CHANGE_CALLBACK_URL },
  );

  if (error) throw new SupabaseAuthError(error);
}
