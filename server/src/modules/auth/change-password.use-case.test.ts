import { AuthApiError } from '@supabase/supabase-js';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { BadRequest } from '../../errors/bad-request.error.ts';
import { SupabaseAuthError } from '../../errors/supabase-auth.error.ts';
import { Unauthorized } from '../../errors/unauthorized.error.ts';
import { WeakPassword } from '../../errors/weak-password.error.ts';
import { isPasswordPwned } from '../../services/pwned-passwords.ts';
import {
  claimsResult,
  createStatelessSupabaseMock,
  createSupabaseMock,
  noClaimsResult,
} from '../../testing/supabase-mock.ts';
import { changePasswordUseCase } from './change-password.use-case.ts';
import { verifyPassword } from './verify-password.ts';

vi.mock('../../services/pwned-passwords.ts', () => ({ isPasswordPwned: vi.fn() }));

vi.mock('./verify-password.ts', () => ({ verifyPassword: vi.fn() }));

const EMAIL = 'user@example.com';

const change = { currentPassword: 'old-password', newPassword: 'new-password' };

let supabase: ReturnType<typeof createSupabaseMock>;
let verifier: ReturnType<typeof createStatelessSupabaseMock>;

const run = () => changePasswordUseCase(supabase.client, verifier.client, change);

beforeEach(() => {
  supabase = createSupabaseMock();
  verifier = createStatelessSupabaseMock();
  supabase.auth.getClaims.mockResolvedValue(claimsResult({ sub: 'user-1', email: EMAIL }));
  vi.mocked(verifyPassword).mockResolvedValue();
  vi.mocked(isPasswordPwned).mockResolvedValue(false);
});

describe('changePasswordUseCase', () => {
  it('проверяет текущий пароль и меняет его на новый', async () => {
    await expect(run()).resolves.toBeUndefined();

    expect(verifyPassword).toHaveBeenCalledWith(verifier.client, EMAIL, change.currentPassword);
    expect(isPasswordPwned).toHaveBeenCalledWith(change.newPassword);
    expect(supabase.auth.updateUser).toHaveBeenCalledWith({
      password: change.newPassword,
      current_password: change.currentPassword,
    });
  });

  it('бросает BadRequest same_password, если новый пароль совпадает с текущим', async () => {
    const error = await changePasswordUseCase(supabase.client, verifier.client, {
      currentPassword: 'same-password',
      newPassword: 'same-password',
    }).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(BadRequest);
    expect(error).toMatchObject({ code: 'same_password' });
    expect(supabase.auth.getClaims).not.toHaveBeenCalled();
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
    expect(verifyPassword).not.toHaveBeenCalled();
  });

  it('не проверяет утечки и не меняет пароль, если текущий пароль неверный', async () => {
    const verifyError = new BadRequest('Invalid current password', 'invalid_current_password');
    vi.mocked(verifyPassword).mockRejectedValue(verifyError);

    await expect(run()).rejects.toBe(verifyError);
    expect(isPasswordPwned).not.toHaveBeenCalled();
    expect(supabase.auth.updateUser).not.toHaveBeenCalled();
  });

  it('бросает WeakPassword pwned и не меняет пароль, если новый пароль утёк', async () => {
    vi.mocked(isPasswordPwned).mockResolvedValue(true);

    const error = await run().catch((e: unknown) => e);

    expect(error).toBeInstanceOf(WeakPassword);
    expect(error).toMatchObject({ reasons: ['pwned'] });
    expect(supabase.auth.updateUser).not.toHaveBeenCalled();
  });

  it('бросает SupabaseAuthError, если Supabase не сменил пароль', async () => {
    supabase.auth.updateUser.mockResolvedValue({
      data: { user: null },
      error: new AuthApiError('Reauthentication required', 401, 'reauthentication_needed'),
    });

    const error = await run().catch((e: unknown) => e);

    expect(error).toBeInstanceOf(SupabaseAuthError);
    expect(error).toMatchObject({ statusCode: 401, code: 'reauthentication_needed' });
  });
});
