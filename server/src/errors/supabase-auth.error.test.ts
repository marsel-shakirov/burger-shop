import {
  AuthApiError,
  AuthRetryableFetchError,
  AuthWeakPasswordError,
} from '@supabase/supabase-js';
import { describe, expect, it } from 'vitest';

import { CustomError } from './custom.error.ts';
import { SupabaseAuthError } from './supabase-auth.error.ts';

describe('SupabaseAuthError', () => {
  it('переносит сообщение, статус и код из ошибки Supabase', () => {
    const error = new SupabaseAuthError(
      new AuthApiError('Invalid login credentials', 400, 'invalid_credentials'),
    );

    expect(error.statusCode).toBe(400);
    expect(error.serializeErrors()).toEqual({
      message: 'Invalid login credentials',
      code: 'invalid_credentials',
      reasons: undefined,
    });
  });

  it.each([401, 422, 429, 500, 503])('сохраняет статус %i', (status) => {
    expect(new SupabaseAuthError(new AuthApiError('Failed', status, undefined)).statusCode).toBe(
      status,
    );
  });

  it.each([
    ['сетевая ошибка со статусом 0', new AuthRetryableFetchError('fetch failed', 0)],
    ['успешный статус', new AuthApiError('Unexpected', 200, undefined)],
    ['редирект', new AuthApiError('Unexpected', 302, undefined)],
  ])('отдаёт 502, если статус не ошибочный: %s', (_case, authError) => {
    expect(new SupabaseAuthError(authError).statusCode).toBe(502);
  });

  it('переносит причины слабого пароля', () => {
    const error = new SupabaseAuthError(
      new AuthWeakPasswordError('Password is too weak', 422, ['length', 'characters']),
    );

    expect(error.statusCode).toBe(422);
    expect(error.serializeErrors()).toEqual({
      message: 'Password is too weak',
      code: 'weak_password',
      reasons: ['length', 'characters'],
    });
  });

  it('наследует CustomError', () => {
    expect(new SupabaseAuthError(new AuthApiError('Failed', 400, undefined))).toBeInstanceOf(
      CustomError,
    );
  });
});
