import { describe, expect, it } from 'vitest';

import { CustomError } from './custom.error.ts';
import { Forbidden } from './forbidden.error.ts';

describe('Forbidden', () => {
  it('по умолчанию отдаёт 403 и общее сообщение', () => {
    const error = new Forbidden();

    expect(error.statusCode).toBe(403);
    expect(error.serializeErrors()).toEqual({ message: 'Forbidden' });
  });

  it('сохраняет переданное сообщение', () => {
    expect(new Forbidden('Origin not allowed').serializeErrors()).toEqual({
      message: 'Origin not allowed',
    });
  });

  it('наследует CustomError', () => {
    expect(new Forbidden()).toBeInstanceOf(CustomError);
  });
});
