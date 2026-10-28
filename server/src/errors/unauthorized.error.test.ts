import { describe, expect, it } from 'vitest';

import { CustomError } from './custom.error.ts';
import { Unauthorized } from './unauthorized.error.ts';

describe('Unauthorized', () => {
  it('по умолчанию отдаёт 401 и общее сообщение', () => {
    const error = new Unauthorized();

    expect(error.statusCode).toBe(401);
    expect(error.serializeErrors()).toEqual({ message: 'Unauthorized' });
  });

  it('сохраняет переданное сообщение', () => {
    expect(new Unauthorized('Session expired').serializeErrors()).toEqual({
      message: 'Session expired',
    });
  });

  it('наследует CustomError', () => {
    expect(new Unauthorized()).toBeInstanceOf(CustomError);
  });
});
