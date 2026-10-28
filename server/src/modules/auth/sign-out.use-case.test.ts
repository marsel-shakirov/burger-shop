import { AuthApiError } from '@supabase/supabase-js';
import { beforeEach, describe, expect, it } from 'vitest';

import { SupabaseAuthError } from '../../errors/supabase-auth.error.ts';
import { createSupabaseMock } from '../../testing/supabase-mock.ts';
import { signOutUseCase } from './sign-out.use-case.ts';

let supabase: ReturnType<typeof createSupabaseMock>;

beforeEach(() => {
  supabase = createSupabaseMock();
});

describe('signOutUseCase', () => {
  it('завершает только текущую сессию', async () => {
    await signOutUseCase(supabase.client);

    expect(supabase.auth.signOut).toHaveBeenCalledWith({ scope: 'local' });
  });

  it('бросает SupabaseAuthError, если Supabase вернул ошибку', async () => {
    supabase.auth.signOut.mockResolvedValue({
      error: new AuthApiError('Service unavailable', 503, undefined),
    });

    await expect(signOutUseCase(supabase.client)).rejects.toBeInstanceOf(SupabaseAuthError);
  });
});
