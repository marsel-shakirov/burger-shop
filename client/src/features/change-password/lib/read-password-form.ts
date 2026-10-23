import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '@/shared/config';
import { getFormString, getWeakPasswordMessage } from '@/shared/lib';

import { SAME_PASSWORD_MESSAGE } from '../config/change-password.constants';
import type { PasswordChange, PasswordFormError } from '../model/change-password.types';

type ReadResult = { ok: true; change: PasswordChange } | { ok: false; error: PasswordFormError };

export const readPasswordForm = (formData: FormData): ReadResult => {
  const currentPassword = getFormString(formData, 'currentPassword');
  const newPassword = getFormString(formData, 'newPassword');
  const confirmPassword = getFormString(formData, 'confirmPassword');

  if (!currentPassword) {
    return {
      ok: false,
      error: { message: 'Введите текущий пароль', field: 'currentPassword' },
    };
  }

  if (newPassword.length < PASSWORD_MIN_LENGTH || newPassword.length > PASSWORD_MAX_LENGTH) {
    return {
      ok: false,
      error: { message: getWeakPasswordMessage(['length']), field: 'newPassword' },
    };
  }

  if (newPassword === currentPassword) {
    return { ok: false, error: { message: SAME_PASSWORD_MESSAGE, field: 'newPassword' } };
  }

  if (confirmPassword !== newPassword) {
    return { ok: false, error: { message: 'Пароли не совпадают', field: 'confirmPassword' } };
  }

  return { ok: true, change: { currentPassword, newPassword } };
};
