import { describe, expect, it } from 'vitest';

import { ApiError } from '@/shared/api/api-error';

import { getSignUpErrorMessage } from './get-sign-up-error-message';

const FALLBACK_MESSAGE = 'Не получилось создать профиль. Попробуйте ещё раз';

const apiError = (code?: string, reasons?: string[]) => new ApiError(400, { code, reasons });

describe('getSignUpErrorMessage: сетевые и неизвестные ошибки', () => {
  it('сообщает об отсутствии связи при сетевой ошибке', () => {
    expect(getSignUpErrorMessage(new TypeError('Failed to fetch'))).toBe(
      'Нет связи с сервером. Проверьте интернет и попробуйте ещё раз',
    );
  });

  it.each([
    ['обычная ошибка', new Error('boom')],
    ['строка', 'boom'],
    ['null', null],
    ['undefined', undefined],
  ])('возвращает общее сообщение, если ошибка — %s', (_label, error) => {
    expect(getSignUpErrorMessage(error)).toBe(FALLBACK_MESSAGE);
  });

  it('возвращает общее сообщение для ApiError без кода', () => {
    expect(getSignUpErrorMessage(apiError())).toBe(FALLBACK_MESSAGE);
  });

  it('возвращает общее сообщение для неизвестного кода', () => {
    expect(getSignUpErrorMessage(apiError('unexpected_failure'))).toBe(FALLBACK_MESSAGE);
  });
});

describe('getSignUpErrorMessage: коды ошибок API', () => {
  it.each([
    ['user_already_exists', 'Профиль с этим email уже есть. Войдите в него'],
    ['email_exists', 'Профиль с этим email уже есть. Войдите в него'],
    ['email_address_invalid', 'Этот email не подходит. Укажите другой адрес'],
    ['over_email_send_rate_limit', 'Слишком много писем подряд. Попробуйте через несколько минут'],
    ['over_request_rate_limit', 'Слишком много попыток. Подождите минуту и попробуйте снова'],
    ['signup_disabled', 'Регистрация временно закрыта'],
  ])('для кода %s возвращает понятное сообщение', (code, message) => {
    expect(getSignUpErrorMessage(apiError(code))).toBe(message);
  });

  it('не зависит от HTTP-статуса ответа', () => {
    const error = new ApiError(429, { code: 'over_request_rate_limit' });

    expect(getSignUpErrorMessage(error)).toBe(
      'Слишком много попыток. Подождите минуту и попробуйте снова',
    );
  });
});

describe('getSignUpErrorMessage: слабый пароль', () => {
  it('сообщает об утечке, если пароль найден в базе утечек', () => {
    expect(getSignUpErrorMessage(apiError('weak_password', ['pwned']))).toBe(
      'Этот пароль встречался в утечках данных. Придумайте другой',
    );
  });

  it('сообщает о допустимой длине пароля', () => {
    expect(getSignUpErrorMessage(apiError('weak_password', ['length']))).toBe(
      'Пароль должен быть от 8 до 72 символов',
    );
  });

  it('ставит утечку выше длины, если причин несколько', () => {
    expect(getSignUpErrorMessage(apiError('weak_password', ['length', 'pwned']))).toBe(
      'Этот пароль встречался в утечках данных. Придумайте другой',
    );
  });

  it.each([
    ['причины не переданы', undefined],
    ['список причин пуст', []],
    ['причина неизвестна', ['characters']],
  ])('требует сложный пароль, если %s', (_label, reasons) => {
    expect(getSignUpErrorMessage(apiError('weak_password', reasons))).toBe(
      'Пароль должен содержать заглавную букву, цифру и спецсимвол',
    );
  });
});
