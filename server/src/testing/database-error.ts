import { DatabaseError } from 'pg';

export function createDatabaseError(code: string, constraint?: string) {
  const error = new DatabaseError('violates constraint', 0, 'error');
  error.code = code;
  error.constraint = constraint;
  return error;
}

export const foreignKeyError = (constraint?: string) => createDatabaseError('23503', constraint);
