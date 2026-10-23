import { describe, expect, it } from 'vitest';

import { readSignUpForm } from './read-sign-up-form';

const createFormData = (fields: Record<string, string>) => {
  const formData = new FormData();

  Object.entries(fields).forEach(([name, value]) => formData.append(name, value));

  return formData;
};

const validFields = {
  email: 'user@example.com',
  password: 'Secret-pass-1',
  confirmPassword: 'Secret-pass-1',
};

describe('readSignUpForm', () => {
  it('возвращает email и пароль без повтора', () => {
    expect(readSignUpForm(createFormData(validFields))).toEqual({
      ok: true,
      credentials: { email: 'user@example.com', password: 'Secret-pass-1' },
    });
  });

  it('обрезает пробелы в email, но не в пароле', () => {
    const formData = createFormData({
      email: '  user@example.com  ',
      password: ' secret pass ',
      confirmPassword: ' secret pass ',
    });

    expect(readSignUpForm(formData)).toEqual({
      ok: true,
      credentials: { email: 'user@example.com', password: ' secret pass ' },
    });
  });

  it.each([
    ['отличается от пароля', 'Secret-pass-2'],
    ['пустой', ''],
    ['отличается пробелом на конце', 'Secret-pass-1 '],
  ])('возвращает ошибку поля confirmPassword, если повтор %s', (_label, confirmPassword) => {
    expect(readSignUpForm(createFormData({ ...validFields, confirmPassword }))).toEqual({
      ok: false,
      error: { message: 'Пароли не совпадают', field: 'confirmPassword' },
    });
  });

  it('считает отсутствующие поля пустыми', () => {
    expect(readSignUpForm(new FormData())).toEqual({
      ok: true,
      credentials: { email: '', password: '' },
    });
  });
});
