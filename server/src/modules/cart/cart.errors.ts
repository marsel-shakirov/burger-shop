import { DatabaseError } from 'pg';

import { BadRequest } from '../../errors/bad-request.error.ts';
import { Unauthorized } from '../../errors/unauthorized.error.ts';
import { CART_PRODUCT_FK, FOREIGN_KEY_VIOLATION } from './cart.constants.ts';

export function toCartError(error: unknown) {
  if (!(error instanceof DatabaseError) || error.code !== FOREIGN_KEY_VIOLATION) {
    return error;
  }

  return error.constraint === CART_PRODUCT_FK
    ? new BadRequest('Product not found', 'product_not_found')
    : new Unauthorized();
}
