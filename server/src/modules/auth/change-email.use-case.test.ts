import { AuthApiError } from '@supabase/supabase-js';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { BadRequest } from '../../errors/bad-request.error.ts';
import { SupabaseAuthError } from '../../errors/supabase-auth.error.ts';
import { Unauthorized } from '../../errors/unauthorized.error.ts';
import {
  claimsResult,
  createStatelessSupabaseMock,
  createSupabaseMock,
  noClaimsResult,
} from '../../testing/supabase-mock.ts';
import { changeEmailUseCase } from './change-email.use-case.ts';
import { verifyPassword } from './verify-password.ts';

vi.mock('./verify-password.ts', () => ({ verifyPassword: vi.fn() }));

const EMAIL = 'user@example.com';

const change = { newEmail: 'new@example.com', currentPassword: 'secret' };

let supabase: ReturnType<typeof createSupabaseMock>;
let verifier: ReturnType<typeof createStatelessSupabaseMock>;

const run = (input = change) => changeEmailUseCase(supabase.client, verifier.client, input);

beforeEach(() => {
  supabase = createSupabaseMock();
  verifier = createStatelessSupabaseMock();
  supabase.auth.getClaims.mockResolvedValue(claimsResult({ sub: 'user-1', email: EMAIL }));
  vi.mocked(verifyPassword).mockResolvedValue();
});

describe('changeEmailUseCase', () => {
  it('проверяет пароль и запрашивает смену email со ссылкой на email-callback', async () => {
    await expect(run()).resolves.toBeUndefined();

    expect(verifyPassword).toHaveBeenCalledWith(verifier.client, EMAIL, change.currentPassword);
    expect(supabase.auth.updateUser).toHaveBeenCalledWith(
      { email: change.newEmail },
      { emailRedirectTo: 'http://localhost:5173/api/auth/email-callback' },
    );
  });

  it('бросает Unauthorized без сессии', async () => {
    supabase.auth.getClaims.mockResolvedValue(noClaimsResult());

    await expect(run()).rejects.toBeInstanceOf(Unauthorized);
    expect(verifyPassword).not.toHaveBeenCalled();
  });

  it('бросает BadRequest email_provider_disabled, если у пользователя нет email', async () => {
    supabase.auth.getClaims.mockResolvedValue(claimsResult({ sub: 'user-1' }));

    const error = await run().catch((e: unknown) => e);

    expect(error).toBeInstanceOf(BadRequest);
    expect(error).toMatchObject({ code: 'email_provider_disabled' });
  });

  it.each([EMAIL, 'User@Example.COM'])(
    'бросает BadRequest same_email, если новый email совпадает с текущим: %s',
    async (newEmail) => {
      const error = await run({ ...change, newEmail }).catch((e: unknown) => e);

      expect(error).toBeInstanceOf(BadRequest);
      expect(error).toMatchObject({ code: 'same_email' });
      expect(verifyPassword).not.toHaveBeenCalled();
    },
  );

  it('не меняет email, если текущий пароль неверный', async () => {
    const verifyError = new BadRequest('Invalid current password', 'invalid_current_password');
    vi.mocked(verifyPassword).mockRejectedValue(verifyError);

    await expect(run()).rejects.toBe(verifyError);
    expect(supabase.auth.updateUser).not.toHaveBeenCalled();
  });

  it('бросает SupabaseAuthError, если Supabase не принял новый email', async () => {
    supabase.auth.updateUser.mockResolvedValue({
      data: { user: null },
      error: new AuthApiError('Email address already registered', 422, 'email_exists'),
    });

    const error = await run().catch((e: unknown) => e);

    expect(error).toBeInstanceOf(SupabaseAuthError);
    expect(error).toMatchObject({ statusCode: 422, code: 'email_exists' });
  });
});
