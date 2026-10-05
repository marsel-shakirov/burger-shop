import { isAuthError, isAuthRetryableFetchError } from '@supabase/supabase-js';

import { EmailTakenError } from '../model/email-taken-error';

export const getSignUpErrorMessage = (error: unknown): string => {
  if (error instanceof EmailTakenError) {
    return 'Профиль с этим email уже есть. Войдите в него';
  }

  if (isAuthRetryableFetchError(error)) {
    return 'Нет связи с сервером. Проверьте интернет и попробуйте ещё раз';
  }

  if (isAuthError(error)) {
    switch (error.code) {
      case 'user_already_exists':
      case 'email_exists':
        return 'Профиль с этим email уже есть. Войдите в него';
      case 'weak_password':
        return 'Пароль слишком простой. Сделайте его длиннее или добавьте цифры';
      case 'email_address_invalid':
        return 'Этот email не подходит. Укажите другой адрес';
      case 'over_email_send_rate_limit':
        return 'Слишком много писем подряд. Попробуйте через несколько минут';
      case 'over_request_rate_limit':
        return 'Слишком много попыток. Подождите минуту и попробуйте снова';
      case 'signup_disabled':
        return 'Регистрация временно закрыта';
    }
  }

  return 'Не получилось создать профиль. Попробуйте ещё раз';
};
