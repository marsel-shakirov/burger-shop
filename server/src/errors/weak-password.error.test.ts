import { describe, expect, it } from 'vitest';

import { CustomError } from './custom.error.ts';
import { WeakPassword } from './weak-password.error.ts';

describe('WeakPassword', () => {
  it('отдаёт 400 с кодом weak_password и причинами', () => {
    const error = new WeakPassword(['length', 'pwned']);

    expect(error.statusCode).toBe(400);
    expect(error.serializeErrors()).toEqual({
      message: 'Weak password',
      code: 'weak_password',
      reasons: ['length', 'pwned'],
    });
  });

  it('сохраняет переданное сообщение', () => {
    expect(new WeakPassword(['characters'], 'Too simple').message).toBe('Too simple');
  });

  it('наследует CustomError', () => {
    expect(new WeakPassword([])).toBeInstanceOf(CustomError);
  });
});
