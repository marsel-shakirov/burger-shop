import { DatabaseError } from 'pg';
import { describe, expect, it } from 'vitest';

import { BadRequest } from '../errors/bad-request.error.ts';
import { Unauthorized } from '../errors/unauthorized.error.ts';
import { createDatabaseError, foreignKeyError } from '../testing/database-error.ts';
import { isForeignKeyViolation, toProductReferenceError } from './foreign-key-error.ts';

const PRODUCT_FK = 'cart_items_product_id_fkey';

describe('isForeignKeyViolation', () => {
  it('узнаёт нарушение внешнего ключа', () => {
    expect(isForeignKeyViolation(foreignKeyError(PRODUCT_FK))).toBe(true);
  });

  it.each([
    ['нарушение уникальности', createDatabaseError('23505')],
    ['ошибка БД без кода', new DatabaseError('boom', 0, 'error')],
    ['обычная ошибка', new Error('boom')],
    ['объект с кодом 23503', { code: '23503', constraint: PRODUCT_FK }],
    ['null', null],
    ['undefined', undefined],
  ])('не принимает за нарушение внешнего ключа: %s', (_case, error) => {
    expect(isForeignKeyViolation(error)).toBe(false);
  });
});

describe('toProductReferenceError', () => {
  it('превращает нарушение ключа товара в BadRequest product_not_found', () => {
    const error = toProductReferenceError(foreignKeyError(PRODUCT_FK), PRODUCT_FK);

    expect(error).toBeInstanceOf(BadRequest);
    expect(error).toMatchObject({ message: 'Product not found', code: 'product_not_found' });
  });

  it.each([
    ['ключ пользователя', 'cart_items_user_id_fkey'],
    ['ключ без имени', undefined],
  ])('превращает нарушение другого ключа в Unauthorized: %s', (_case, constraint) => {
    expect(toProductReferenceError(foreignKeyError(constraint), PRODUCT_FK)).toBeInstanceOf(
      Unauthorized,
    );
  });

  it.each([
    ['нарушение уникальности', createDatabaseError('23505', PRODUCT_FK)],
    ['обычная ошибка', new Error('boom')],
    ['строка', 'boom'],
  ])('возвращает остальные ошибки без изменений: %s', (_case, error) => {
    expect(toProductReferenceError(error, PRODUCT_FK)).toBe(error);
  });
});
