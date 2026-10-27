import { describe, expect, it } from 'vitest';

import { getWeakPasswordMessage } from './get-weak-password-message';

describe('getWeakPasswordMessage', () => {
  it('сообщает об утечке, если пароль найден в базе утечек', () => {
    expect(getWeakPasswordMessage(['pwned'])).toBe(
      'Этот пароль встречался в утечках данных. Придумайте другой',
    );
  });

  it('сообщает о допустимой длине пароля', () => {
    expect(getWeakPasswordMessage(['length'])).toBe('Пароль должен быть от 8 до 72 символов');
  });

  it('ставит утечку выше длины, если причин несколько', () => {
    expect(getWeakPasswordMessage(['length', 'pwned'])).toBe(
      'Этот пароль встречался в утечках данных. Придумайте другой',
    );
  });

  it.each([
    ['причины не переданы', undefined],
    ['список причин пуст', []],
    ['причина неизвестна', ['characters']],
  ])('требует сложный пароль, если %s', (_label, reasons) => {
    expect(getWeakPasswordMessage(reasons)).toBe(
      'Пароль должен содержать заглавную букву, цифру и спецсимвол',
    );
  });
});
