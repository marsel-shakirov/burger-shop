import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { isApiError, onUnauthorized } from '@/shared/api';

import { getSession } from './get-session';

const fetchMock = vi.fn<typeof fetch>();

const user = { id: 'user-1', email: 'user@example.com' };

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe('getSession', () => {
  it('запрашивает сессию с сигналом отмены', async () => {
    fetchMock.mockResolvedValue(Response.json({ user }));
    const controller = new AbortController();

    await getSession({ signal: controller.signal });

    expect(fetchMock).toHaveBeenCalledExactlyOnceWith('/api/auth/session', {
      signal: controller.signal,
    });
  });

  it('возвращает пользователя', async () => {
    fetchMock.mockResolvedValue(Response.json({ user }));

    await expect(getSession()).resolves.toEqual(user);
  });

  it('возвращает null без сессии', async () => {
    fetchMock.mockResolvedValue(Response.json({ user: null }));

    await expect(getSession()).resolves.toBeNull();
  });

  it('при ошибке бросает ApiError', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 500 }));

    const error: unknown = await getSession().catch((reason: unknown) => reason);

    expect(isApiError(error)).toBe(true);
    expect(error).toMatchObject({ status: 500 });
  });

  it('при 401 не оповещает о потере авторизации: это и есть проверка сессии', async () => {
    const listener = vi.fn();
    const unsubscribe = onUnauthorized(listener);
    fetchMock.mockResolvedValue(new Response(null, { status: 401 }));

    await getSession().catch(() => {});
    unsubscribe();

    expect(listener).not.toHaveBeenCalled();
  });

  it('пробрасывает отмену запроса', async () => {
    const error = new DOMException('Aborted', 'AbortError');
    fetchMock.mockRejectedValue(error);

    await expect(getSession()).rejects.toBe(error);
  });
});
