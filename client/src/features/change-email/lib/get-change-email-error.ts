import { isApiError, isNetworkError } from '@/shared/api';

import { SAME_EMAIL_MESSAGE } from '../config/change-email.constants';
import type { EmailFormError } from '../model/change-email.types';

export const getChangeEmailError = (error: unknown): EmailFormError => {
  if (isNetworkError(error)) {
    return { message: 'Нет связи с сервером. Проверьте интернет и попробуйте ещё раз' };
  }

  if (isApiError(error)) {
    switch (error.code) {
      case 'invalid_current_password':
        return { message: 'Текущий пароль указан неверно', field: 'currentPassword' };
      case 'same_email':
        return { message: SAME_EMAIL_MESSAGE, field: 'newEmail' };
      case 'email_exists':
        return { message: 'Этот email уже занят другим профилем', field: 'newEmail' };
      case 'email_address_invalid':
        return { message: 'Этот email не подходит. Укажите другой адрес', field: 'newEmail' };
      case 'over_email_send_rate_limit':
        return { message: 'Слишком много писем подряд. Попробуйте через несколько минут' };
      case 'over_request_rate_limit':
        return { message: 'Слишком много попыток. Подождите час и попробуйте снова' };
    }
  }

  return { message: 'Не удалось сменить email. Попробуйте ещё раз' };
};
