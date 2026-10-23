import type { AuthCredentials } from '@/entities/session';
import { PASSWORDS_MISMATCH_MESSAGE } from '@/shared/config';
import { getFormString } from '@/shared/lib';

import type { SignUpFormError } from '../model/sign-up.types';

type ReadResult =
  { ok: true; credentials: AuthCredentials } | { ok: false; error: SignUpFormError };

export const readSignUpForm = (formData: FormData): ReadResult => {
  const email = getFormString(formData, 'email').trim();
  const password = getFormString(formData, 'password');
  const confirmPassword = getFormString(formData, 'confirmPassword');

  if (confirmPassword !== password) {
    return {
      ok: false,
      error: { message: PASSWORDS_MISMATCH_MESSAGE, field: 'confirmPassword' },
    };
  }

  return { ok: true, credentials: { email, password } };
};
