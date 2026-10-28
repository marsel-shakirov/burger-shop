import { describe, expect, it } from 'vitest';

import { Conflict } from './conflict.error.ts';
import { CustomError } from './custom.error.ts';

describe('Conflict', () => {
  it('по умолчанию отдаёт 409 и общее сообщение без кода', () => {
    const error = new Conflict();

    expect(error.statusCode).toBe(409);
    expect(error.message).toBe('Conflict');
    expect(error.serializeErrors()).toEqual({ message: 'Conflict', code: undefined });
  });

  it('сохраняет переданные сообщение и код', () => {
    const error = new Conflict('Email already registered', 'email_exists');

    expect(error.serializeErrors()).toEqual({
      message: 'Email already registered',
      code: 'email_exists',
    });
  });

  it('наследует CustomError', () => {
    expect(new Conflict()).toBeInstanceOf(CustomError);
  });
});
