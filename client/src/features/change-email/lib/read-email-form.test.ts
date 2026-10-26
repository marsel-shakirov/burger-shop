import { describe, expect, it } from 'vitest';

import { SAME_EMAIL_MESSAGE } from '../config/change-email.constants';
import { readEmailForm } from './read-email-form';

const CURRENT_EMAIL = 'user@example.com';

const createFormData = (fields: Record<string, string>) => {
  const formData = new FormData();

  Object.entries(fields).forEach(([name, value]) => formData.append(name, value));

  return formData;
};

const validFields = { newEmail: 'new@example.com', currentPassword: 'Old-pass-1' };

describe('readEmailForm', () => {
  it('возвращает новый email и текущий пароль', () => {
    expect(readEmailForm(createFormData(validFields), CURRENT_EMAIL)).toEqual({
      ok: true,
      change: { newEmail: 'new@example.com', currentPassword: 'Old-pass-1' },
    });
  });

  it('обрезает пробелы в email, но не в пароле', () => {
    const formData = createFormData({ newEmail: '  new@example.com ', currentPassword: ' pass ' });

    expect(readEmailForm(formData, CURRENT_EMAIL)).toEqual({
      ok: true,
      change: { newEmail: 'new@example.com', currentPassword: ' pass ' },
    });
  });

  it.each([
    ['пустой', ''],
    ['из пробелов', '   '],
  ])('требует новый email, если он %s', (_label, newEmail) => {
    expect(readEmailForm(createFormData({ ...validFields, newEmail }), CURRENT_EMAIL)).toEqual({
      ok: false,
      error: { message: 'Введите новый email', field: 'newEmail' },
    });
  });

  it.each([
    ['совпадает с текущим', CURRENT_EMAIL],
    ['отличается только регистром', 'User@Example.COM'],
  ])('отклоняет новый email, который %s', (_label, newEmail) => {
    expect(readEmailForm(createFormData({ ...validFields, newEmail }), CURRENT_EMAIL)).toEqual({
      ok: false,
      error: { message: SAME_EMAIL_MESSAGE, field: 'newEmail' },
    });
  });

  it('требует текущий пароль', () => {
    const formData = createFormData({ ...validFields, currentPassword: '' });

    expect(readEmailForm(formData, CURRENT_EMAIL)).toEqual({
      ok: false,
      error: { message: 'Введите текущий пароль', field: 'currentPassword' },
    });
  });

  it('проверяет email раньше пароля', () => {
    expect(readEmailForm(new FormData(), CURRENT_EMAIL)).toEqual({
      ok: false,
      error: { message: 'Введите новый email', field: 'newEmail' },
    });
  });
});
