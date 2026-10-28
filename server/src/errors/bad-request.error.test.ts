import { describe, expect, it } from 'vitest';

import { BadRequest } from './bad-request.error.ts';
import { CustomError } from './custom.error.ts';

describe('BadRequest', () => {
  it('по умолчанию отдаёт 400 и общее сообщение без кода', () => {
    const error = new BadRequest();

    expect(error.statusCode).toBe(400);
    expect(error.message).toBe('Bad request');
    expect(error.code).toBeUndefined();
    expect(error.serializeErrors()).toEqual({ message: 'Bad request', code: undefined });
  });

  it('сохраняет переданные сообщение и код', () => {
    const error = new BadRequest('Product not found', 'product_not_found');

    expect(error.message).toBe('Product not found');
    expect(error.code).toBe('product_not_found');
    expect(error.serializeErrors()).toEqual({
      message: 'Product not found',
      code: 'product_not_found',
    });
  });

  it('наследует CustomError и Error', () => {
    const error = new BadRequest();

    expect(error).toBeInstanceOf(CustomError);
    expect(error).toBeInstanceOf(Error);
  });
});
