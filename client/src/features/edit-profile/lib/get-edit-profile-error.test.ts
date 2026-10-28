import { describe, expect, it } from 'vitest';

import { ApiError } from '@/shared/api';

import { getEditProfileError } from './get-edit-profile-error';

const FALLBACK_ERROR = { message: 'Не удалось сохранить. Попробуйте ещё раз' };

const apiError = (code?: string, status = 400) => new ApiError(status, { code });

describe('getEditProfileError: сетевые и неизвестные ошибки', () => {
  it('сообщает об отсутствии связи при сетевой ошибке без привязки к полю', () => {
    expect(getEditProfileError(new TypeError('Failed to fetch'))).toEqual({
      message: 'Нет связи с сервером. Проверьте интернет и попробуйте ещё раз',
    });
  });

  it.each([
    ['обычная ошибка', new Error('boom')],
    ['строка', 'invalid_name'],
    ['null', null],
    ['undefined', undefined],
  ])('возвращает общую ошибку, если ошибка — %s', (_label, error) => {
    expect(getEditProfileError(error)).toEqual(FALLBACK_ERROR);
  });

  it('возвращает общую ошибку для ApiError без кода', () => {
    expect(getEditProfileError(apiError())).toEqual(FALLBACK_ERROR);
  });

  it('возвращает общую ошибку для пустого кода', () => {
    expect(getEditProfileError(apiError(''))).toEqual(FALLBACK_ERROR);
  });

  it.each(['unexpected_failure', 'bad_request', 'invalid_email'])(
    'возвращает общую ошибку для кода %s',
    (code) => {
      expect(getEditProfileError(apiError(code))).toEqual(FALLBACK_ERROR);
    },
  );

  it.each(['toString', 'constructor', '__proto__', 'hasOwnProperty'])(
    'не находит ошибку поля по свойству прототипа %s',
    (code) => {
      expect(getEditProfileError(apiError(code))).toEqual(FALLBACK_ERROR);
    },
  );
});

describe('getEditProfileError: ошибки полей', () => {
  it.each([
    ['invalid_name', 'name', 'Имя должно быть не длиннее 50 символов'],
    ['invalid_phone', 'phone', 'Проверьте номер: от 10 до 15 цифр, можно начать с +'],
    ['invalid_birth_date', 'birthDate', 'Проверьте дату рождения'],
    ['invalid_gender', 'gender', 'Выберите пол из списка'],
  ])('для кода %s привязывает ошибку к полю %s', (code, field, message) => {
    expect(getEditProfileError(apiError(code))).toEqual({ field, message });
  });

  it('не зависит от HTTP-статуса ответа', () => {
    expect(getEditProfileError(apiError('invalid_phone', 422))).toEqual({
      field: 'phone',
      message: 'Проверьте номер: от 10 до 15 цифр, можно начать с +',
    });
  });
});
