import { describe, expect, it } from 'vitest';

import { getFormString } from './get-form-string';

const formDataOf = (entries: Array<[string, string | Blob]>) => {
  const formData = new FormData();

  entries.forEach(([name, value]) => formData.append(name, value));

  return formData;
};

describe('getFormString: строковые значения', () => {
  it('возвращает значение поля', () => {
    expect(getFormString(formDataOf([['email', 'user@example.com']]), 'email')).toBe(
      'user@example.com',
    );
  });

  it('возвращает пустую строку для пустого поля', () => {
    expect(getFormString(formDataOf([['name', '']]), 'name')).toBe('');
  });

  it('не обрезает пробелы, чтобы не менять пароль', () => {
    expect(getFormString(formDataOf([['password', '  secret  ']]), 'password')).toBe('  secret  ');
  });

  it('сохраняет переводы строк и кириллицу', () => {
    expect(getFormString(formDataOf([['comment', 'Без лука\nПожалуйста']]), 'comment')).toBe(
      'Без лука\nПожалуйста',
    );
  });

  it('возвращает первое значение, если поле повторяется', () => {
    const formData = formDataOf([
      ['gender', 'female'],
      ['gender', 'male'],
    ]);

    expect(getFormString(formData, 'gender')).toBe('female');
  });

  it('читает нужное поле среди нескольких', () => {
    const formData = formDataOf([
      ['email', 'user@example.com'],
      ['password', 'secret'],
    ]);

    expect(getFormString(formData, 'password')).toBe('secret');
  });
});

describe('getFormString: нет строкового значения', () => {
  it('возвращает пустую строку, если поля нет', () => {
    expect(getFormString(new FormData(), 'email')).toBe('');
  });

  it('различает регистр в имени поля', () => {
    expect(getFormString(formDataOf([['email', 'user@example.com']]), 'Email')).toBe('');
  });

  it('возвращает пустую строку для файла', () => {
    const file = new File(['avatar'], 'avatar.png', { type: 'image/png' });

    expect(getFormString(formDataOf([['avatar', file]]), 'avatar')).toBe('');
  });

  it('возвращает пустую строку для Blob', () => {
    expect(getFormString(formDataOf([['avatar', new Blob(['avatar'])]]), 'avatar')).toBe('');
  });

  it('смотрит только на первое значение, даже если следом идёт строка', () => {
    const formData = formDataOf([
      ['avatar', new File(['avatar'], 'avatar.png')],
      ['avatar', 'avatar.png'],
    ]);

    expect(getFormString(formData, 'avatar')).toBe('');
  });
});
