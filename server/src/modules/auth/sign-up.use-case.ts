import { Conflict } from '../../errors/conflict.error.ts';
import { SupabaseAuthError } from '../../errors/supabase-auth.error.ts';
import { WeakPassword } from '../../errors/weak-password.error.ts';
import { isPasswordPwned } from '../../services/pwned-passwords.ts';
import type { Supabase } from '../../supabase.ts';
import { AUTH_CALLBACK_URL } from './auth.constants.ts';
import { toSessionUser } from './auth.mapper.ts';
import type { Credentials } from './auth.schema.ts';

export async function signUpUseCase(supabase: Supabase, { email, password }: Credentials) {
  if (await isPasswordPwned(password)) {
    throw new WeakPassword(['pwned']);
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: AUTH_CALLBACK_URL },
  });

  if (error) throw new SupabaseAuthError(error);

  if (data.user?.identities?.length === 0) {
    throw new Conflict('Email already registered', 'email_exists');
  }

  return data.session ? toSessionUser(data.session.user) : null;
}
