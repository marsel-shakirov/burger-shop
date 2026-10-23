import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { isApiError, onUnauthorized } from '@/shared/api';

import type { CartEntry } from '../model/cart.types';
import { mergeCart } from './merge-cart';

const fetchMock = vi.fn<typeof fetch>();

const guestItems: CartEntry[] = [
  { productId: 1, quantity: 2 },
  { productId: 2, quantity: 1 },
];

const mergedItems: CartEntry[] = [
  { productId: 1, quantity: 3 },
  { productId: 2, quantity: 1 },
  { productId: 5, quantity: 4 },
];

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe('mergeCart', () => {
  it('отправляет позиции POST-запросом в JSON', async () => {
    fetchMock.mockResolvedValue(Response.json({ items: mergedItems }));

    await mergeCart(guestItems);

    expect(fetchMock).toHaveBeenCalledExactlyOnceWith('/api/cart/merge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: guestItems }),
    });
  });

  it('возвращает объединённую корзину из ответа', async () => {
    fetchMock.mockResolvedValue(Response.json({ items: mergedItems }));

    await expect(mergeCart(guestItems)).resolves.toEqual(mergedItems);
  });

  it('при ошибке бросает ApiError', async () => {
    fetchMock.mockResolvedValue(Response.json({ message: 'Товар не найден' }, { status: 400 }));

    const error: unknown = await mergeCart(guestItems).catch((reason: unknown) => reason);

    expect(isApiError(error)).toBe(true);
    expect(error).toMatchObject({ status: 400, message: 'Товар не найден' });
  });

  it('при 401 оповещает о потере авторизации и бросает ApiError', async () => {
    const listener = vi.fn();
    const unsubscribe = onUnauthorized(listener);
    fetchMock.mockResolvedValue(new Response(null, { status: 401 }));

    await expect(mergeCart(guestItems)).rejects.toMatchObject({ status: 401 });
    unsubscribe();

    expect(listener).toHaveBeenCalledOnce();
  });
});
