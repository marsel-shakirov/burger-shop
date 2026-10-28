import { DatabaseError } from 'pg';

import { BadRequest } from '../errors/bad-request.error.ts';
import { Unauthorized } from '../errors/unauthorized.error.ts';

const FOREIGN_KEY_VIOLATION = '23503';

export function isForeignKeyViolation(error: unknown): error is DatabaseError {
  return error instanceof DatabaseError && error.code === FOREIGN_KEY_VIOLATION;
}

export function toProductReferenceError(error: unknown, productConstraint: string) {
  if (!isForeignKeyViolation(error)) {
    return error;
  }

  return error.constraint === productConstraint
    ? new BadRequest('Product not found', 'product_not_found')
    : new Unauthorized();
}
