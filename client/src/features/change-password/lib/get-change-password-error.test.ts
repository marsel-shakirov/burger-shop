import { describe, expect, it } from 'vitest';

import { ApiError } from '@/shared/api';

import { getChangePasswordError } from './get-change-password-error';

const FALLBACK_ERROR = { message: 'Не удалось сменить пароль. Попробуйте ещё раз' };

const apiError = (code?: string, reasons?: string[], status = 400) =>
  new ApiError(status, { code, reasons });

describe('getChangePasswordError: сетевые и неизвестные ошибки', () => {
  it('сообщает об отсутствии связи при сетевой ошибке без привязки к полю', () => {
    expect(getChangePasswordError(new TypeError('Failed to fetch'))).toEqual({
      message: 'Нет связи с сервером. Проверьте интернет и попробуйте ещё раз',
    });
  });

  it.each([
    ['обычная ошибка', new Error('boom')],
    ['строка', 'invalid_current_password'],
    ['null', null],
    ['undefined', undefined],
  ])('возвращает общую ошибку, если ошибка — %s', (_label, error) => {
    expect(getChangePasswordError(error)).toEqual(FALLBACK_ERROR);
  });

  it('возвращает общую ошибку для ApiError без кода', () => {
    expect(getChangePasswordError(apiError())).toEqual(FALLBACK_ERROR);
  });

  it.each(['unexpected_failure', 'bad_request', 'invalid_credentials'])(
    'возвращает общую ошибку для кода %s',
    (code) => {
      expect(getChangePasswordError(apiError(code))).toEqual(FALLBACK_ERROR);
    },
  );
});

describe('getChangePasswordError: ошибки полей', () => {
  it('привязывает неверный текущий пароль к полю currentPassword', () => {
    expect(getChangePasswordError(apiError('invalid_current_password'))).toEqual({
      message: 'Текущий пароль указан неверно',
      field: 'currentPassword',
    });
  });

  it('привязывает совпадение паролей к полю newPassword', () => {
    expect(getChangePasswordError(apiError('same_password', undefined, 422))).toEqual({
      message: 'Новый пароль должен отличаться от текущего',
      field: 'newPassword',
    });
  });

  it.each([
    [['pwned'], 'Этот пароль встречался в утечках данных. Придумайте другой'],
    [['length'], 'Пароль должен быть от 8 до 72 символов'],
    [undefined, 'Пароль должен содержать заглавную букву, цифру и спецсимвол'],
  ])('привязывает слабый пароль с причинами %j к полю newPassword', (reasons, message) => {
    expect(getChangePasswordError(apiError('weak_password', reasons))).toEqual({
      message,
      field: 'newPassword',
    });
  });
});

describe('getChangePasswordError: ошибки без поля', () => {
  it.each([
    ['over_request_rate_limit', 'Слишком много попыток. Подождите 15 минут и попробуйте снова'],
    ['reauthentication_needed', 'Войдите в профиль заново и повторите смену пароля'],
  ])('для кода %s возвращает понятное сообщение', (code, message) => {
    expect(getChangePasswordError(apiError(code))).toEqual({ message });
  });

  it('не зависит от HTTP-статуса ответа', () => {
    expect(getChangePasswordError(apiError('over_request_rate_limit', undefined, 429))).toEqual({
      message: 'Слишком много попыток. Подождите 15 минут и попробуйте снова',
    });
  });
});
