import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { isApiError, onUnauthorized } from '@/shared/api';

import { mergeFavorites } from './merge-favorites';

const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe('mergeFavorites', () => {
  it('отправляет id товаров POST-запросом в JSON', async () => {
    fetchMock.mockResolvedValue(Response.json({ productIds: [3, 1, 7] }));

    await mergeFavorites([3, 1]);

    expect(fetchMock).toHaveBeenCalledExactlyOnceWith('/api/favorites/merge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productIds: [3, 1] }),
    });
  });

  it('возвращает объединённое избранное из ответа', async () => {
    fetchMock.mockResolvedValue(Response.json({ productIds: [3, 1, 7] }));

    await expect(mergeFavorites([3, 1])).resolves.toEqual([3, 1, 7]);
  });

  it('при ошибке бросает ApiError', async () => {
    fetchMock.mockResolvedValue(Response.json({ message: 'Товар не найден' }, { status: 400 }));

    const error: unknown = await mergeFavorites([3]).catch((reason: unknown) => reason);

    expect(isApiError(error)).toBe(true);
    expect(error).toMatchObject({ status: 400, message: 'Товар не найден' });
  });

  it('при 401 оповещает о потере авторизации', async () => {
    const listener = vi.fn();
    const unsubscribe = onUnauthorized(listener);
    fetchMock.mockResolvedValue(new Response(null, { status: 401 }));

    await expect(mergeFavorites([3])).rejects.toMatchObject({ status: 401 });
    unsubscribe();

    expect(listener).toHaveBeenCalledOnce();
  });
});
