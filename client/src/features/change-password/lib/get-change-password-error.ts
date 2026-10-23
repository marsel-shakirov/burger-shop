import { isApiError, isNetworkError } from '@/shared/api';
import { getWeakPasswordMessage } from '@/shared/lib';

import { SAME_PASSWORD_MESSAGE } from '../config/change-password.constants';
import type { PasswordFormError } from '../model/change-password.types';

export const getChangePasswordError = (error: unknown): PasswordFormError => {
  if (isNetworkError(error)) {
    return { message: 'Нет связи с сервером. Проверьте интернет и попробуйте ещё раз' };
  }

  if (isApiError(error)) {
    switch (error.code) {
      case 'invalid_current_password':
        return { message: 'Текущий пароль указан неверно', field: 'currentPassword' };
      case 'weak_password':
        return { message: getWeakPasswordMessage(error.reasons), field: 'newPassword' };
      case 'same_password':
        return { message: SAME_PASSWORD_MESSAGE, field: 'newPassword' };
      case 'over_request_rate_limit':
        return { message: 'Слишком много попыток. Подождите 15 минут и попробуйте снова' };
      case 'reauthentication_needed':
        return { message: 'Войдите в профиль заново и повторите смену пароля' };
    }
  }

  return { message: 'Не удалось сменить пароль. Попробуйте ещё раз' };
};
