import { AuthApiError, AuthWeakPasswordError } from '@supabase/supabase-js';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Conflict } from '../../errors/conflict.error.ts';
import { SupabaseAuthError } from '../../errors/supabase-auth.error.ts';
import { WeakPassword } from '../../errors/weak-password.error.ts';
import { isPasswordPwned } from '../../services/pwned-passwords.ts';
import { createSupabaseMock } from '../../testing/supabase-mock.ts';
import { signUpUseCase } from './sign-up.use-case.ts';

vi.mock('../../services/pwned-passwords.ts', () => ({ isPasswordPwned: vi.fn() }));

const credentials = { email: 'user@example.com', password: 'long-enough-password' };

const user = { id: 'user-1', email: 'user@example.com', identities: [{ id: 'identity-1' }] };

let supabase: ReturnType<typeof createSupabaseMock>;

beforeEach(() => {
  supabase = createSupabaseMock();
  vi.mocked(isPasswordPwned).mockResolvedValue(false);
});

describe('signUpUseCase', () => {
  it('регистрирует с ссылкой подтверждения на callback', async () => {
    supabase.auth.signUp.mockResolvedValue({ data: { user, session: null }, error: null });

    await signUpUseCase(supabase.client, credentials);

    expect(isPasswordPwned).toHaveBeenCalledWith(credentials.password);
    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      ...credentials,
      options: { emailRedirectTo: 'http://localhost:5173/api/auth/callback' },
    });
  });

  it('возвращает пользователя, если Supabase сразу открыл сессию', async () => {
    supabase.auth.signUp.mockResolvedValue({ data: { user, session: { user } }, error: null });

    await expect(signUpUseCase(supabase.client, credentials)).resolves.toEqual({
      id: 'user-1',
      email: 'user@example.com',
    });
  });

  it('возвращает null, если нужно подтвердить email', async () => {
    supabase.auth.signUp.mockResolvedValue({ data: { user, session: null }, error: null });

    await expect(signUpUseCase(supabase.client, credentials)).resolves.toBeNull();
  });

  it('бросает WeakPassword pwned и не регистрирует, если пароль утёк', async () => {
    vi.mocked(isPasswordPwned).mockResolvedValue(true);

    const error = await signUpUseCase(supabase.client, credentials).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(WeakPassword);
    expect(error).toMatchObject({ reasons: ['pwned'] });
    expect(supabase.auth.signUp).not.toHaveBeenCalled();
  });

  it('бросает Conflict email_exists, если email уже зарегистрирован', async () => {
    supabase.auth.signUp.mockResolvedValue({
      data: { user: { ...user, identities: [] }, session: null },
      error: null,
    });

    const error = await signUpUseCase(supabase.client, credentials).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(Conflict);
    expect(error).toMatchObject({ code: 'email_exists' });
  });

  it.each([
    ['ошибка API', new AuthApiError('Signups not allowed', 422, 'signup_disabled')],
    ['слабый пароль', new AuthWeakPasswordError('Password is too weak', 422, ['characters'])],
  ])('бросает SupabaseAuthError, если Supabase вернул ошибку: %s', async (_case, authError) => {
    supabase.auth.signUp.mockResolvedValue({
      data: { user: null, session: null },
      error: authError,
    });

    const error = await signUpUseCase(supabase.client, credentials).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(SupabaseAuthError);
    expect(error).toMatchObject({ statusCode: 422, code: authError.code });
  });
});
