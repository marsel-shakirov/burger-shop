import { BadRequest } from '../../errors/bad-request.error.ts';
import { SupabaseAuthError } from '../../errors/supabase-auth.error.ts';
import { Unauthorized } from '../../errors/unauthorized.error.ts';
import { WeakPassword } from '../../errors/weak-password.error.ts';
import { isPasswordPwned } from '../../services/pwned-passwords.ts';
import type { StatelessSupabase, Supabase } from '../../supabase.ts';
import type { PasswordChange } from './auth.schema.ts';
import { verifyPassword } from './verify-password.ts';

export async function changePasswordUseCase(
  supabase: Supabase,
  verifier: StatelessSupabase,
  { currentPassword, newPassword }: PasswordChange,
) {
  if (currentPassword === newPassword) {
    throw new BadRequest('New password must differ from the current one', 'same_password');
  }

  const { data } = await supabase.auth.getClaims();

  if (!data) throw new Unauthorized();

  const { email } = data.claims;

  if (!email) {
    throw new BadRequest('Password sign-in is not available', 'email_provider_disabled');
  }

  await verifyPassword(verifier, email, currentPassword);

  if (await isPasswordPwned(newPassword)) {
    throw new WeakPassword(['pwned']);
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
    current_password: currentPassword,
  });

  if (error) throw new SupabaseAuthError(error);
}
