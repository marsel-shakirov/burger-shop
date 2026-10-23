import { describe, expect, it } from 'vitest';

import { readPasswordForm } from './read-password-form';

const createFormData = (fields: Record<string, string>) => {
  const formData = new FormData();

  Object.entries(fields).forEach(([name, value]) => formData.append(name, value));

  return formData;
};

const validFields = {
  currentPassword: 'Old-pass-1',
  newPassword: 'New-pass-42!',
  confirmPassword: 'New-pass-42!',
};

describe('readPasswordForm', () => {
  it('возвращает текущий и новый пароль без повтора', () => {
    expect(readPasswordForm(createFormData(validFields))).toEqual({
      ok: true,
      change: { currentPassword: 'Old-pass-1', newPassword: 'New-pass-42!' },
    });
  });

  it('не обрезает пробелы в паролях', () => {
    const formData = createFormData({
      currentPassword: ' old pass ',
      newPassword: ' new pass ',
      confirmPassword: ' new pass ',
    });

    expect(readPasswordForm(formData)).toEqual({
      ok: true,
      change: { currentPassword: ' old pass ', newPassword: ' new pass ' },
    });
  });

  it('требует текущий пароль', () => {
    expect(readPasswordForm(createFormData({ ...validFields, currentPassword: '' }))).toEqual({
      ok: false,
      error: { message: 'Введите текущий пароль', field: 'currentPassword' },
    });
  });

  it.each([
    ['короче 8 символов', 'a'.repeat(7)],
    ['длиннее 72 символов', 'a'.repeat(73)],
  ])('отклоняет новый пароль %s', (_label, newPassword) => {
    const formData = createFormData({ ...validFields, newPassword, confirmPassword: newPassword });

    expect(readPasswordForm(formData)).toEqual({
      ok: false,
      error: { message: 'Пароль должен быть от 8 до 72 символов', field: 'newPassword' },
    });
  });

  it.each([
    ['ровно 8 символов', 'a'.repeat(8)],
    ['ровно 72 символа', 'a'.repeat(72)],
  ])('принимает новый пароль длиной %s', (_label, newPassword) => {
    const formData = createFormData({ ...validFields, newPassword, confirmPassword: newPassword });

    expect(readPasswordForm(formData).ok).toBe(true);
  });

  it('отклоняет новый пароль, совпадающий с текущим', () => {
    const formData = createFormData({
      currentPassword: 'Same-pass-1',
      newPassword: 'Same-pass-1',
      confirmPassword: 'Same-pass-1',
    });

    expect(readPasswordForm(formData)).toEqual({
      ok: false,
      error: { message: 'Новый пароль должен отличаться от текущего', field: 'newPassword' },
    });
  });

  it('сообщает, если повтор не совпадает с новым паролем', () => {
    const formData = createFormData({ ...validFields, confirmPassword: 'New-pass-43!' });

    expect(readPasswordForm(formData)).toEqual({
      ok: false,
      error: { message: 'Пароли не совпадают', field: 'confirmPassword' },
    });
  });

  it('проверяет длину раньше совпадения повтора', () => {
    const formData = createFormData({ ...validFields, newPassword: 'short' });

    expect(readPasswordForm(formData)).toMatchObject({
      ok: false,
      error: { field: 'newPassword' },
    });
  });

  it('считает отсутствующие поля пустыми', () => {
    expect(readPasswordForm(new FormData())).toEqual({
      ok: false,
      error: { message: 'Введите текущий пароль', field: 'currentPassword' },
    });
  });
});
