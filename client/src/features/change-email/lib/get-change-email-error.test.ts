import { describe, expect, it } from 'vitest';

import { ApiError } from '@/shared/api/api-error';

import { SAME_EMAIL_MESSAGE } from '../config/change-email.constants';
import { getChangeEmailError } from './get-change-email-error';

const FALLBACK_ERROR = { message: 'Не удалось сменить email. Попробуйте ещё раз' };

const apiError = (code?: string, status = 400) => new ApiError(status, { code });

describe('getChangeEmailError: сетевые и неизвестные ошибки', () => {
  it('сообщает об отсутствии связи при сетевой ошибке без привязки к полю', () => {
    expect(getChangeEmailError(new TypeError('Failed to fetch'))).toEqual({
      message: 'Нет связи с сервером. Проверьте интернет и попробуйте ещё раз',
    });
  });

  it.each([
    ['обычная ошибка', new Error('boom')],
    ['строка', 'email_exists'],
    ['null', null],
    ['undefined', undefined],
  ])('возвращает общую ошибку, если ошибка — %s', (_label, error) => {
    expect(getChangeEmailError(error)).toEqual(FALLBACK_ERROR);
  });

  it('возвращает общую ошибку для ApiError без кода', () => {
    expect(getChangeEmailError(apiError())).toEqual(FALLBACK_ERROR);
  });

  it.each(['unexpected_failure', 'bad_request', 'email_provider_disabled'])(
    'возвращает общую ошибку для кода %s',
    (code) => {
      expect(getChangeEmailError(apiError(code))).toEqual(FALLBACK_ERROR);
    },
  );
});

describe('getChangeEmailError: ошибки полей', () => {
  it('привязывает неверный текущий пароль к полю currentPassword', () => {
    expect(getChangeEmailError(apiError('invalid_current_password'))).toEqual({
      message: 'Текущий пароль указан неверно',
      field: 'currentPassword',
    });
  });

  it.each([
    ['same_email', SAME_EMAIL_MESSAGE],
    ['email_exists', 'Этот email уже занят другим профилем'],
    ['email_address_invalid', 'Этот email не подходит. Укажите другой адрес'],
  ])('привязывает код %s к полю newEmail', (code, message) => {
    expect(getChangeEmailError(apiError(code, 422))).toEqual({ message, field: 'newEmail' });
  });
});

describe('getChangeEmailError: ошибки без поля', () => {
  it.each([
    ['over_email_send_rate_limit', 'Слишком много писем подряд. Попробуйте через несколько минут'],
    ['over_request_rate_limit', 'Слишком много попыток. Подождите час и попробуйте снова'],
  ])('для кода %s возвращает понятное сообщение', (code, message) => {
    expect(getChangeEmailError(apiError(code, 429))).toEqual({ message });
  });
});
