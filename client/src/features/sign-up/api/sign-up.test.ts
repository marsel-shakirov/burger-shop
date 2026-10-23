import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { AuthCredentials, SessionUser } from '@/entities/session';
import { isApiError } from '@/shared/api';

import { signUp } from './sign-up';

const fetchMock = vi.fn<typeof fetch>();

const credentials: AuthCredentials = { email: 'user@example.com', password: 'secret-password' };

const user: SessionUser = { id: 'user-1', email: 'user@example.com' };

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe('signUp', () => {
  it('отправляет учётные данные POST-запросом в JSON', async () => {
    fetchMock.mockResolvedValue(Response.json({ user }));

    await signUp(credentials);

    expect(fetchMock).toHaveBeenCalledExactlyOnceWith('/api/auth/sign-up', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
  });

  it('возвращает пользователя, если сессия создана сразу', async () => {
    fetchMock.mockResolvedValue(Response.json({ user }));

    await expect(signUp(credentials)).resolves.toEqual(user);
  });

  it('возвращает null, если нужно подтвердить email', async () => {
    fetchMock.mockResolvedValue(Response.json({ user: null }));

    await expect(signUp(credentials)).resolves.toBeNull();
  });

  it('при ошибке бросает ApiError со статусом, кодом и причинами', async () => {
    fetchMock.mockResolvedValue(
      Response.json(
        { message: 'Слабый пароль', code: 'weak_password', reasons: ['pwned'] },
        { status: 422 },
      ),
    );

    const error: unknown = await signUp(credentials).catch((reason: unknown) => reason);

    expect(isApiError(error)).toBe(true);
    expect(error).toMatchObject({
      status: 422,
      message: 'Слабый пароль',
      code: 'weak_password',
      reasons: ['pwned'],
    });
  });

  it('при ошибке без JSON бросает ApiError с сообщением по умолчанию', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 500 }));

    await expect(signUp(credentials)).rejects.toMatchObject({
      status: 500,
      message: 'Request failed with status 500',
    });
  });

  it('пробрасывает сетевую ошибку', async () => {
    const error = new TypeError('Failed to fetch');
    fetchMock.mockRejectedValue(error);

    await expect(signUp(credentials)).rejects.toBe(error);
  });
});
