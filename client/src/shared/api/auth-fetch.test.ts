import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { authFetch } from './auth-fetch';
import { onUnauthorized } from './unauthorized';

const fetchMock = vi.fn<typeof fetch>();

const onUnauthorizedListener = vi.fn();

let unsubscribe: () => void;

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
  unsubscribe = onUnauthorized(onUnauthorizedListener);
});

afterEach(() => {
  unsubscribe();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe('authFetch', () => {
  it('передаёт url и параметры запроса в fetch', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));
    const init: RequestInit = { method: 'DELETE', headers: { 'X-Test': '1' } };

    await authFetch('/api/cart', init);

    expect(fetchMock).toHaveBeenCalledExactlyOnceWith('/api/cart', init);
  });

  it('без параметров передаёт пустой объект', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));

    await authFetch('/api/cart');

    expect(fetchMock).toHaveBeenCalledExactlyOnceWith('/api/cart', {});
  });

  it('возвращает ответ fetch без изменений', async () => {
    const response = new Response(null, { status: 200 });
    fetchMock.mockResolvedValue(response);

    await expect(authFetch('/api/cart')).resolves.toBe(response);
  });

  it('при 401 оповещает о потере авторизации и всё равно возвращает ответ', async () => {
    const response = new Response(null, { status: 401 });
    fetchMock.mockResolvedValue(response);

    await expect(authFetch('/api/cart')).resolves.toBe(response);
    expect(onUnauthorizedListener).toHaveBeenCalledOnce();
  });

  it.each([200, 204, 400, 403, 404, 500])('при статусе %i не оповещает', async (status) => {
    fetchMock.mockResolvedValue(new Response(null, { status }));

    await authFetch('/api/cart');

    expect(onUnauthorizedListener).not.toHaveBeenCalled();
  });

  it('пробрасывает сетевую ошибку и не оповещает', async () => {
    const error = new TypeError('Failed to fetch');
    fetchMock.mockRejectedValue(error);

    await expect(authFetch('/api/cart')).rejects.toBe(error);
    expect(onUnauthorizedListener).not.toHaveBeenCalled();
  });
});
