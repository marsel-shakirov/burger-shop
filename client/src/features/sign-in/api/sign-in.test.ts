import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { AuthCredentials, SessionUser } from '@/entities/session';
import { isApiError, onUnauthorized } from '@/shared/api';

import { signIn } from './sign-in';

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

describe('signIn', () => {
  it('отправляет учётные данные POST-запросом в JSON', async () => {
    fetchMock.mockResolvedValue(Response.json({ user }));

    await signIn(credentials);

    expect(fetchMock).toHaveBeenCalledExactlyOnceWith('/api/auth/sign-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
  });

  it('возвращает пользователя из ответа', async () => {
    fetchMock.mockResolvedValue(Response.json({ user }));

    await expect(signIn(credentials)).resolves.toEqual(user);
  });

  it('при ошибке бросает ApiError со статусом и данными из ответа', async () => {
    const body = { message: 'Неверный email или пароль', code: 'invalid_credentials' };
    fetchMock.mockResolvedValue(Response.json(body, { status: 401 }));

    const error: unknown = await signIn(credentials).catch((reason: unknown) => reason);

    expect(isApiError(error)).toBe(true);
    expect(error).toMatchObject({
      status: 401,
      message: 'Неверный email или пароль',
      code: 'invalid_credentials',
    });
  });

  it('при 401 не оповещает о потере авторизации: это неверный пароль, а не истёкшая сессия', async () => {
    const listener = vi.fn();
    const unsubscribe = onUnauthorized(listener);
    fetchMock.mockResolvedValue(new Response(null, { status: 401 }));

    await signIn(credentials).catch(() => {});
    unsubscribe();

    expect(listener).not.toHaveBeenCalled();
  });

  it('при ошибке без JSON бросает ApiError с сообщением по умолчанию', async () => {
    fetchMock.mockResolvedValue(new Response('Bad Gateway', { status: 502 }));

    await expect(signIn(credentials)).rejects.toMatchObject({
      status: 502,
      message: 'Request failed with status 502',
    });
  });

  it('пробрасывает сетевую ошибку', async () => {
    const error = new TypeError('Failed to fetch');
    fetchMock.mockRejectedValue(error);

    await expect(signIn(credentials)).rejects.toBe(error);
  });
});
