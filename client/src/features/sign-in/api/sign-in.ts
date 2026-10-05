import { supabase } from '@/shared/api';

import type { SignInCredentials } from '../model/sign-in.types';

export const signIn = async ({ email, password }: SignInCredentials): Promise<void> => {
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    throw error;
  }
};
