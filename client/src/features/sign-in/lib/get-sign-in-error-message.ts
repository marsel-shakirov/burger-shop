import { isApiError, isNetworkError } from '@/shared/api';

export const getSignInErrorMessage = (error: unknown): string => {
  if (isNetworkError(error)) {
    return 'Нет связи с сервером. Проверьте интернет и попробуйте ещё раз';
  }

  if (isApiError(error)) {
    switch (error.code) {
      case 'invalid_credentials':
        return 'Неверный email или пароль';
      case 'email_not_confirmed':
        return 'Email не подтверждён. Перейдите по ссылке из письма BurgerShop';
      case 'over_request_rate_limit':
        return 'Слишком много попыток. Подождите минуту и попробуйте снова';
    }
  }

  return 'Не получилось войти. Попробуйте ещё раз';
};
