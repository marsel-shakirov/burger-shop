import { describe, expect, it } from 'vitest';

import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from './auth.constants.ts';
import {
  authCallbackQuerySchema,
  changeEmailBodySchema,
  changePasswordBodySchema,
  emailCallbackQuerySchema,
  signInBodySchema,
  signUpBodySchema,
} from './auth.schema.ts';

const EMAIL = 'user@example.com';

const password = (length: number) => 'a'.repeat(length);

describe('signInBodySchema', () => {
  it('принимает email и пароль любой непустой длины', () => {
    expect(signInBodySchema.safeParse({ email: EMAIL, password: 'a' }).success).toBe(true);
  });

  it.each([
    ['некорректный email', { email: 'user', password: 'secret' }],
    ['пустой пароль', { email: EMAIL, password: '' }],
    ['нет пароля', { email: EMAIL }],
    ['лишнее поле', { email: EMAIL, password: 'secret', remember: true }],
  ])('не принимает: %s', (_case, body) => {
    expect(signInBodySchema.safeParse(body).success).toBe(false);
  });
});

describe('signUpBodySchema', () => {
  it.each([PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH])('принимает пароль длиной %i', (length) => {
    expect(signUpBodySchema.safeParse({ email: EMAIL, password: password(length) }).success).toBe(
      true,
    );
  });

  it.each([PASSWORD_MIN_LENGTH - 1, PASSWORD_MAX_LENGTH + 1])(
    'не принимает пароль длиной %i',
    (length) => {
      expect(signUpBodySchema.safeParse({ email: EMAIL, password: password(length) }).success).toBe(
        false,
      );
    },
  );

  it.each([
    ['некорректный email', { email: 'user@', password: password(PASSWORD_MIN_LENGTH) }],
    ['лишнее поле', { email: EMAIL, password: password(PASSWORD_MIN_LENGTH), name: 'Иван' }],
  ])('не принимает: %s', (_case, body) => {
    expect(signUpBodySchema.safeParse(body).success).toBe(false);
  });
});

describe('changePasswordBodySchema', () => {
  it.each([PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH])(
    'принимает новый пароль длиной %i',
    (length) => {
      expect(
        changePasswordBodySchema.safeParse({ currentPassword: 'a', newPassword: password(length) })
          .success,
      ).toBe(true);
    },
  );

  it.each([
    ['короткий новый пароль', { currentPassword: 'a', newPassword: password(7) }],
    ['длинный новый пароль', { currentPassword: 'a', newPassword: password(73) }],
    ['пустой текущий пароль', { currentPassword: '', newPassword: password(8) }],
    ['лишнее поле', { currentPassword: 'a', newPassword: password(8), email: EMAIL }],
  ])('не принимает: %s', (_case, body) => {
    expect(changePasswordBodySchema.safeParse(body).success).toBe(false);
  });
});

describe('changeEmailBodySchema', () => {
  it('принимает новый email и текущий пароль', () => {
    expect(changeEmailBodySchema.safeParse({ newEmail: EMAIL, currentPassword: 'a' }).success).toBe(
      true,
    );
  });

  it.each([
    ['некорректный email', { newEmail: 'user', currentPassword: 'a' }],
    ['пустой текущий пароль', { newEmail: EMAIL, currentPassword: '' }],
    ['лишнее поле', { newEmail: EMAIL, currentPassword: 'a', email: EMAIL }],
  ])('не принимает: %s', (_case, body) => {
    expect(changeEmailBodySchema.safeParse(body).success).toBe(false);
  });
});

describe('authCallbackQuerySchema', () => {
  it('берёт code и отбрасывает остальные параметры', () => {
    expect(authCallbackQuerySchema.parse({ code: 'abc', type: 'signup' })).toEqual({
      code: 'abc',
    });
  });

  it.each([
    ['нет code', {}],
    ['пустой code', { code: '' }],
    ['несколько code', { code: ['a', 'b'] }],
  ])('не принимает: %s', (_case, query) => {
    expect(authCallbackQuerySchema.safeParse(query).success).toBe(false);
  });
});

describe('emailCallbackQuerySchema', () => {
  it.each([
    ['только code', { code: 'abc' }],
    ['только message', { message: 'Confirmation link accepted' }],
    ['пустой запрос', {}],
  ])('принимает: %s', (_case, query) => {
    expect(emailCallbackQuerySchema.parse(query)).toEqual(query);
  });

  it.each([
    ['пустой code', { code: '' }],
    ['пустой message', { message: '' }],
  ])('не принимает: %s', (_case, query) => {
    expect(emailCallbackQuerySchema.safeParse(query).success).toBe(false);
  });
});
