import { describe, expect, it } from 'vitest';

import { getFieldErrorProps } from './get-field-error-props';

describe('getFieldErrorProps: поле без ошибки', () => {
  it('не добавляет aria-атрибуты, если ни ошибки, ни подсказки нет', () => {
    expect(getFieldErrorProps({ invalid: false })).toStrictEqual({
      'aria-invalid': undefined,
      'aria-describedby': undefined,
    });
  });

  it('не ссылается на текст ошибки, пока поле валидно', () => {
    expect(getFieldErrorProps({ invalid: false, errorId: 'name-error' })).toStrictEqual({
      'aria-invalid': undefined,
      'aria-describedby': undefined,
    });
  });

  it('ссылается на подсказку', () => {
    expect(getFieldErrorProps({ invalid: false, hintId: 'password-hint' })).toStrictEqual({
      'aria-invalid': undefined,
      'aria-describedby': 'password-hint',
    });
  });

  it('ссылается только на подсказку, если ошибки нет', () => {
    expect(
      getFieldErrorProps({ invalid: false, errorId: 'password-error', hintId: 'password-hint' }),
    ).toStrictEqual({
      'aria-invalid': undefined,
      'aria-describedby': 'password-hint',
    });
  });
});

describe('getFieldErrorProps: поле с ошибкой', () => {
  it('помечает поле невалидным и ссылается на текст ошибки', () => {
    expect(getFieldErrorProps({ invalid: true, errorId: 'name-error' })).toStrictEqual({
      'aria-invalid': true,
      'aria-describedby': 'name-error',
    });
  });

  it('ставит подсказку перед ошибкой', () => {
    expect(
      getFieldErrorProps({ invalid: true, errorId: 'password-error', hintId: 'password-hint' }),
    ).toStrictEqual({
      'aria-invalid': true,
      'aria-describedby': 'password-hint password-error',
    });
  });

  it('помечает поле невалидным, даже если текста ошибки нет', () => {
    expect(getFieldErrorProps({ invalid: true })).toStrictEqual({
      'aria-invalid': true,
      'aria-describedby': undefined,
    });
  });

  it('ссылается на подсказку, если текста ошибки нет', () => {
    expect(getFieldErrorProps({ invalid: true, hintId: 'password-hint' })).toStrictEqual({
      'aria-invalid': true,
      'aria-describedby': 'password-hint',
    });
  });
});

describe('getFieldErrorProps: пустые id', () => {
  it.each([
    ['пустой id ошибки', { invalid: true, errorId: '', hintId: 'phone-hint' }, 'phone-hint'],
    ['пустой id подсказки', { invalid: true, errorId: 'phone-error', hintId: '' }, 'phone-error'],
  ])('пропускает %s', (_case, options, describedBy) => {
    expect(getFieldErrorProps(options)['aria-describedby']).toBe(describedBy);
  });

  it('не добавляет aria-describedby, если оба id пустые', () => {
    expect(
      getFieldErrorProps({ invalid: true, errorId: '', hintId: '' })['aria-describedby'],
    ).toBeUndefined();
  });
});
