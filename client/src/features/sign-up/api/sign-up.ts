import { supabase } from '@/shared/api';
import { routes } from '@/shared/config';

import { EmailTakenError } from '../model/email-taken-error';
import type { SignUpCredentials } from '../model/sign-up.types';

export const signUp = async ({ email, password }: SignUpCredentials): Promise<void> => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: new URL(routes.profile, window.location.origin).href },
  });

  if (error) {
    throw error;
  }

  if (data.user?.identities?.length === 0) {
    throw new EmailTakenError();
  }
};
