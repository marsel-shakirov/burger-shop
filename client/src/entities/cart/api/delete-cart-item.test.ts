import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { isApiError } from '@/shared/api';

import { deleteCartItem } from './delete-cart-item';

const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe('deleteCartItem', () => {
  it('отправляет DELETE на позицию товара', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));

    await expect(deleteCartItem(5)).resolves.toBeUndefined();

    expect(fetchMock).toHaveBeenCalledExactlyOnceWith('/api/cart/5', { method: 'DELETE' });
  });

  it('при ошибке бросает ApiError', async () => {
    fetchMock.mockResolvedValue(Response.json({ message: 'Позиция не найдена' }, { status: 404 }));

    const error: unknown = await deleteCartItem(5).catch((reason: unknown) => reason);

    expect(isApiError(error)).toBe(true);
    expect(error).toMatchObject({ status: 404, message: 'Позиция не найдена' });
  });
});
