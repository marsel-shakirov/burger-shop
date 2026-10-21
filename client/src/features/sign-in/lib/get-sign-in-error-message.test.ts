import { describe, expect, it } from 'vitest';

import { ApiError } from '@/shared/api/api-error';

import { getSignInErrorMessage } from './get-sign-in-error-message';

const FALLBACK_MESSAGE = 'Не получилось войти. Попробуйте ещё раз';

const apiError = (code?: string, status = 400) => new ApiError(status, { code });

describe('getSignInErrorMessage: сетевые и неизвестные ошибки', () => {
  it('сообщает об отсутствии связи при сетевой ошибке', () => {
    expect(getSignInErrorMessage(new TypeError('Failed to fetch'))).toBe(
      'Нет связи с сервером. Проверьте интернет и попробуйте ещё раз',
    );
  });

  it.each([
    ['обычная ошибка', new Error('boom')],
    ['строка', 'boom'],
    ['null', null],
    ['undefined', undefined],
  ])('возвращает общее сообщение, если ошибка — %s', (_label, error) => {
    expect(getSignInErrorMessage(error)).toBe(FALLBACK_MESSAGE);
  });

  it('возвращает общее сообщение для ApiError без кода', () => {
    expect(getSignInErrorMessage(apiError())).toBe(FALLBACK_MESSAGE);
  });

  it.each(['unexpected_failure', 'weak_password', 'email_exists', 'signup_disabled'])(
    'возвращает общее сообщение для кода %s',
    (code) => {
      expect(getSignInErrorMessage(apiError(code))).toBe(FALLBACK_MESSAGE);
    },
  );
});

describe('getSignInErrorMessage: коды ошибок API', () => {
  it.each([
    ['invalid_credentials', 'Неверный email или пароль'],
    ['email_not_confirmed', 'Email не подтверждён. Перейдите по ссылке из письма BurgerShop'],
    ['over_request_rate_limit', 'Слишком много попыток. Подождите минуту и попробуйте снова'],
  ])('для кода %s возвращает понятное сообщение', (code, message) => {
    expect(getSignInErrorMessage(apiError(code))).toBe(message);
  });

  it('не зависит от HTTP-статуса ответа', () => {
    expect(getSignInErrorMessage(apiError('over_request_rate_limit', 429))).toBe(
      'Слишком много попыток. Подождите минуту и попробуйте снова',
    );
  });
});
