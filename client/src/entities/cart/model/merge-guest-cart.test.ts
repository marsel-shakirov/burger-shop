import { QueryClient } from '@tanstack/react-query';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { cartQueryOptions } from '../api/cart-query-options';
import { mergeCart } from '../api/merge-cart';
import { CART_STORAGE_KEY, GUEST_CART_MERGE_LOCK } from '../config/cart.constants';
import { useCartStore } from './cart.store';
import type { CartEntry } from './cart.types';
import { mergeGuestCart } from './merge-guest-cart';

vi.mock('../api/merge-cart', () => ({ mergeCart: vi.fn() }));

const locks = vi.hoisted(() => {
  const data = new Map<string, string>();
  let queue: Promise<unknown> = Promise.resolve();

  vi.stubGlobal('window', {
    localStorage: {
      getItem: (key: string) => data.get(key) ?? null,
      setItem: (key: string, value: string) => {
        data.set(key, value);
      },
      removeItem: (key: string) => {
        data.delete(key);
      },
    },
  });

  const request = vi.fn((_name: string, callback: () => Promise<unknown>) => {
    const result = queue.then(callback);
    queue = result.catch(() => {});
    return result;
  });

  vi.stubGlobal('navigator', { locks: { request } });

  return { request };
});

const USER_ID = 'user-1';

const guestItems: CartEntry[] = [
  { productId: 1, quantity: 2 },
  { productId: 2, quantity: 1 },
];

const mergedItems: CartEntry[] = [
  { productId: 1, quantity: 3 },
  { productId: 2, quantity: 1 },
  { productId: 5, quantity: 4 },
];

const mergeCartMock = vi.mocked(mergeCart);

let queryClient: QueryClient;

const getCachedItems = (userId = USER_ID) =>
  queryClient.getQueryData(cartQueryOptions(userId).queryKey);

const getGuestItems = () => useCartStore.getState().items;

beforeEach(() => {
  queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  useCartStore.setState({ items: guestItems });
});

afterEach(() => {
  queryClient.clear();
  vi.clearAllMocks();
});

describe('mergeGuestCart', () => {
  it('ничего не отправляет, если гостевая корзина пуста', async () => {
    useCartStore.setState({ items: [] });

    await mergeGuestCart(queryClient, USER_ID);

    expect(mergeCartMock).not.toHaveBeenCalled();
    expect(getCachedItems()).toBeUndefined();
  });

  it('отправляет гостевую корзину на сервер', async () => {
    mergeCartMock.mockResolvedValue(mergedItems);

    await mergeGuestCart(queryClient, USER_ID);

    expect(mergeCartMock).toHaveBeenCalledExactlyOnceWith(guestItems);
  });

  it('кладёт ответ сервера в кэш корзины пользователя', async () => {
    queryClient.setQueryData(cartQueryOptions(USER_ID).queryKey, [{ productId: 9, quantity: 1 }]);
    mergeCartMock.mockResolvedValue(mergedItems);

    await mergeGuestCart(queryClient, USER_ID);

    expect(getCachedItems()).toEqual(mergedItems);
  });

  it('не трогает кэш корзины другого пользователя', async () => {
    const otherItems: CartEntry[] = [{ productId: 9, quantity: 1 }];
    queryClient.setQueryData(cartQueryOptions('user-2').queryKey, otherItems);
    mergeCartMock.mockResolvedValue(mergedItems);

    await mergeGuestCart(queryClient, USER_ID);

    expect(getCachedItems('user-2')).toBe(otherItems);
  });

  it('очищает гостевую корзину после успешного слияния', async () => {
    mergeCartMock.mockResolvedValue(mergedItems);

    await mergeGuestCart(queryClient, USER_ID);

    expect(getGuestItems()).toEqual([]);
  });

  it('загрузка корзины, начатая до слияния, не перетирает его результат', async () => {
    let resolveStale: (items: CartEntry[]) => void = () => {};
    const staleResponse = new Promise<CartEntry[]>((resolve) => {
      resolveStale = resolve;
    });
    const loading = queryClient
      .query({ ...cartQueryOptions(USER_ID), queryFn: () => staleResponse })
      .catch(() => {});
    mergeCartMock.mockResolvedValue(mergedItems);

    await mergeGuestCart(queryClient, USER_ID);
    resolveStale([{ productId: 9, quantity: 1 }]);
    await loading;

    expect(getCachedItems()).toEqual(mergedItems);
  });
});

describe('mergeGuestCart: несколько вкладок', () => {
  const writeStoredItems = (items: CartEntry[]) =>
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ state: { items }, version: 1 }));

  it('сливает корзину под общей для вкладок блокировкой', async () => {
    mergeCartMock.mockResolvedValue(mergedItems);

    await mergeGuestCart(queryClient, USER_ID);

    expect(locks.request).toHaveBeenCalledExactlyOnceWith(
      GUEST_CART_MERGE_LOCK,
      expect.any(Function),
    );
  });

  it('берёт гостевую корзину из хранилища, а не из памяти вкладки', async () => {
    writeStoredItems([]);

    await mergeGuestCart(queryClient, USER_ID);

    expect(mergeCartMock).not.toHaveBeenCalled();
    expect(getGuestItems()).toEqual([]);
  });

  it('отправляет корзину один раз, если слияние запущено дважды', async () => {
    mergeCartMock.mockResolvedValue(mergedItems);

    await Promise.all([mergeGuestCart(queryClient, USER_ID), mergeGuestCart(queryClient, USER_ID)]);

    expect(mergeCartMock).toHaveBeenCalledExactlyOnceWith(guestItems);
    expect(getCachedItems()).toEqual(mergedItems);
  });
});

describe('mergeGuestCart: ошибка сервера', () => {
  it('пробрасывает ошибку', async () => {
    const error = new Error('Network error');
    mergeCartMock.mockRejectedValue(error);

    await expect(mergeGuestCart(queryClient, USER_ID)).rejects.toBe(error);
  });

  it('сохраняет гостевую корзину', async () => {
    mergeCartMock.mockRejectedValue(new Error('Network error'));

    await mergeGuestCart(queryClient, USER_ID).catch(() => {});

    expect(getGuestItems()).toEqual(guestItems);
  });

  it('не меняет кэш корзины пользователя', async () => {
    const cachedItems: CartEntry[] = [{ productId: 9, quantity: 1 }];
    queryClient.setQueryData(cartQueryOptions(USER_ID).queryKey, cachedItems);
    mergeCartMock.mockRejectedValue(new Error('Network error'));

    await mergeGuestCart(queryClient, USER_ID).catch(() => {});

    expect(getCachedItems()).toBe(cachedItems);
  });
});
