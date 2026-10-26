import { getFormString } from '@/shared/lib';

import { SAME_EMAIL_MESSAGE } from '../config/change-email.constants';
import type { EmailChange, EmailFormError } from '../model/change-email.types';

type ReadResult = { ok: true; change: EmailChange } | { ok: false; error: EmailFormError };

export const readEmailForm = (formData: FormData, currentEmail: string): ReadResult => {
  const newEmail = getFormString(formData, 'newEmail').trim();
  const currentPassword = getFormString(formData, 'currentPassword');

  if (!newEmail) {
    return { ok: false, error: { message: 'Введите новый email', field: 'newEmail' } };
  }

  if (newEmail.toLowerCase() === currentEmail.toLowerCase()) {
    return { ok: false, error: { message: SAME_EMAIL_MESSAGE, field: 'newEmail' } };
  }

  if (!currentPassword) {
    return {
      ok: false,
      error: { message: 'Введите текущий пароль', field: 'currentPassword' },
    };
  }

  return { ok: true, change: { newEmail, currentPassword } };
};
