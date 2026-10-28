import { AuthApiError } from '@supabase/supabase-js';
import { beforeEach, describe, expect, it } from 'vitest';

import { BadRequest } from '../../errors/bad-request.error.ts';
import { SupabaseAuthError } from '../../errors/supabase-auth.error.ts';
import { createStatelessSupabaseMock } from '../../testing/supabase-mock.ts';
import { verifyPassword } from './verify-password.ts';

const EMAIL = 'user@example.com';

let verifier: ReturnType<typeof createStatelessSupabaseMock>;

beforeEach(() => {
  verifier = createStatelessSupabaseMock();
});

describe('verifyPassword', () => {
  it('проверяет пароль входом и закрывает проверочную сессию', async () => {
    verifier.auth.signInWithPassword.mockResolvedValue({ data: {}, error: null });

    await verifyPassword(verifier.client, EMAIL, 'secret');

    expect(verifier.auth.signInWithPassword).toHaveBeenCalledWith({
      email: EMAIL,
      password: 'secret',
    });
    expect(verifier.auth.signOut).toHaveBeenCalledWith({ scope: 'local' });
  });

  it('бросает BadRequest invalid_current_password при неверном пароле', async () => {
    verifier.auth.signInWithPassword.mockResolvedValue({
      data: {},
      error: new AuthApiError('Invalid login credentials', 400, 'invalid_credentials'),
    });

    const error = await verifyPassword(verifier.client, EMAIL, 'wrong').catch((e: unknown) => e);

    expect(error).toBeInstanceOf(BadRequest);
    expect(error).toMatchObject({ code: 'invalid_current_password' });
    expect(verifier.auth.signOut).not.toHaveBeenCalled();
  });

  it('бросает SupabaseAuthError при остальных ошибках входа', async () => {
    verifier.auth.signInWithPassword.mockResolvedValue({
      data: {},
      error: new AuthApiError('Too many requests', 429, 'over_request_rate_limit'),
    });

    const error = await verifyPassword(verifier.client, EMAIL, 'secret').catch((e: unknown) => e);

    expect(error).toBeInstanceOf(SupabaseAuthError);
    expect(error).toMatchObject({ statusCode: 429, code: 'over_request_rate_limit' });
    expect(verifier.auth.signOut).not.toHaveBeenCalled();
  });
});
