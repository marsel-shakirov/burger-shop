import { isApiError, isNetworkError } from '@/shared/api';

import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '../model/sign-up.constants';

const getWeakPasswordMessage = (reasons: string[] = []): string => {
  if (reasons.includes('pwned')) {
    return 'Этот пароль встречался в утечках данных. Придумайте другой';
  }

  if (reasons.includes('length')) {
    return `Пароль должен быть от ${PASSWORD_MIN_LENGTH} до ${PASSWORD_MAX_LENGTH} символов`;
  }

  return 'Пароль должен содержать заглавную букву, цифру и спецсимвол';
};

export const getSignUpErrorMessage = (error: unknown): string => {
  if (isNetworkError(error)) {
    return 'Нет связи с сервером. Проверьте интернет и попробуйте ещё раз';
  }

  if (isApiError(error)) {
    switch (error.code) {
      case 'user_already_exists':
      case 'email_exists':
        return 'Профиль с этим email уже есть. Войдите в него';
      case 'weak_password':
        return getWeakPasswordMessage(error.reasons);
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
