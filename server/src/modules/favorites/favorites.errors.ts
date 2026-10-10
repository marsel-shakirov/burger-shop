import { DatabaseError } from 'pg';

import { BadRequest } from '../../errors/bad-request.error.ts';
import { Unauthorized } from '../../errors/unauthorized.error.ts';
import { FAVORITES_PRODUCT_FK, FOREIGN_KEY_VIOLATION } from './favorites.constants.ts';

export function toFavoriteError(error: unknown) {
  if (!(error instanceof DatabaseError) || error.code !== FOREIGN_KEY_VIOLATION) {
    return error;
  }

  return error.constraint === FAVORITES_PRODUCT_FK
    ? new BadRequest('Product not found', 'product_not_found')
    : new Unauthorized();
}
