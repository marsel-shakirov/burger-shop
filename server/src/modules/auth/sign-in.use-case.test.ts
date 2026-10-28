import { AuthApiError } from '@supabase/supabase-js';
import { beforeEach, describe, expect, it } from 'vitest';

import { SupabaseAuthError } from '../../errors/supabase-auth.error.ts';
import { createSupabaseMock } from '../../testing/supabase-mock.ts';
import { signInUseCase } from './sign-in.use-case.ts';

const credentials = { email: 'user@example.com', password: 'secret' };

let supabase: ReturnType<typeof createSupabaseMock>;

beforeEach(() => {
  supabase = createSupabaseMock();
});

describe('signInUseCase', () => {
  it('входит по email и паролю и возвращает пользователя сессии', async () => {
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: { id: 'user-1', email: 'user@example.com', role: 'authenticated' } },
      error: null,
    });

    await expect(signInUseCase(supabase.client, credentials)).resolves.toEqual({
      id: 'user-1',
      email: 'user@example.com',
    });
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith(credentials);
  });

  it('бросает SupabaseAuthError, если Supabase вернул ошибку', async () => {
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: null, session: null },
      error: new AuthApiError('Invalid login credentials', 400, 'invalid_credentials'),
    });

    const error = await signInUseCase(supabase.client, credentials).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(SupabaseAuthError);
    expect(error).toMatchObject({ statusCode: 400, code: 'invalid_credentials' });
  });
});
