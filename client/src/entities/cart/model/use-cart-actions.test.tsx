import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { getSessionState } from '@/entities/session/@x/cart';
import { createTestQueryClient, createWrapper } from '@/shared/testing';

import { cartQueryOptions } from '../api/cart-query-options';
import { MAX_ITEM_QUANTITY } from '../config/cart.constants';
import { useCartStore } from './cart.store';
import type { CartEntry } from './cart.types';
import { useCartActions } from './use-cart-actions';

const session = vi.hoisted(() => {
  const current: ReturnType<typeof getSessionState> = { status: 'guest', user: null };

  return { current };
});

vi.mock('@/entities/session/@x/cart', () => ({
  useSessionStatus: () => session.current.status,
  useSessionUser: () => session.current.user,
  getSessionState: () => session.current,
}));

const USER = { id: 'user-1', email: 'user@example.com' };

const QUERY_KEY = cartQueryOptions(USER.id).queryKey;

const serverItems: CartEntry[] = [
  { productId: 1, quantity: 2 },
  { productId: 2, quantity: 1 },
];

const fetchMock = vi.fn<typeof fetch>();

let queryClient = createTestQueryClient();

const render = () => renderHook(useCartActions, { wrapper: createWrapper({ queryClient }) });

const getCachedItems = () => queryClient.getQueryData(QUERY_KEY);

const getRequests = () =>
  fetchMock.mock.calls.map(([input, init]) => `${init?.method ?? 'GET'} ${input as string}`);

const getMutationRequests = () => getRequests().filter((request) => !request.startsWith('GET'));

const respondOk = () =>
  fetchMock.mockImplementation((_input, init) =>
    Promise.resolve(
      init?.method ? new Response(null, { status: 204 }) : Response.json({ items: serverItems }),
    ),
  );

const holdMutations = () => {
  const pending: Array<() => void> = [];

  fetchMock.mockImplementation((_input, init) =>
    init?.method
      ? new Promise((resolve) => pending.push(() => resolve(new Response(null, { status: 204 }))))
      : Promise.resolve(Response.json({ items: serverItems })),
  );

  return {
    release: () => {
      respondOk();
      pending.splice(0).forEach((resolve) => resolve());
    },
  };
};

const waitForCache = (items: CartEntry[]) => waitFor(() => expect(getCachedItems()).toEqual(items));

const waitForIdle = () =>
  waitFor(() => {
    expect(queryClient.getMutationCache().getAll()).not.toHaveLength(0);
    expect(queryClient.isMutating()).toBe(0);
  });

const settle = () => act(() => new Promise<void>((resolve) => setTimeout(resolve)));

beforeEach(() => {
  queryClient = createTestQueryClient();
  session.current = { status: 'authenticated', user: USER };
  queryClient.setQueryData(QUERY_KEY, serverItems);
  useCartStore.setState({ items: [] });
  vi.stubGlobal('fetch', fetchMock);
  respondOk();
});

afterEach(() => {
  queryClient.clear();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe('useCartActions: гость', () => {
  beforeEach(() => {
    session.current = { status: 'guest', user: null };
  });

  it('меняет гостевую корзину и ничего не отправляет', () => {
    const { result } = render();

    act(() => {
      result.current.addItem(5);
      result.current.addItem(5);
      result.current.decrementItem(5);
    });

    expect(useCartStore.getState().items).toEqual([{ productId: 5, quantity: 1 }]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('очищает гостевую корзину', () => {
    useCartStore.setState({ items: serverItems });
    const { result } = render();

    act(() => result.current.clearCart());

    expect(useCartStore.getState().items).toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('useCartActions: изменение позиции', () => {
  it('меняет кэш до ответа сервера и отправляет новое количество', async () => {
    const server = holdMutations();
    const { result } = render();

    act(() => result.current.addItem(1));

    await waitForCache([
      { productId: 1, quantity: 3 },
      { productId: 2, quantity: 1 },
    ]);
    server.release();
    await waitForIdle();
    expect(fetchMock).toHaveBeenCalledWith('/api/cart/1', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: 3 }),
    });
  });

  it('удаляет позицию DELETE-запросом, когда количество доходит до нуля', async () => {
    const server = holdMutations();
    const { result } = render();

    act(() => result.current.decrementItem(2));

    await waitForCache([{ productId: 1, quantity: 2 }]);
    server.release();
    await waitForIdle();
    expect(getMutationRequests()).toEqual(['DELETE /api/cart/2']);
  });

  it('removeItem удаляет позицию целиком', async () => {
    const server = holdMutations();
    const { result } = render();

    act(() => result.current.removeItem(1));

    await waitForCache([{ productId: 2, quantity: 1 }]);
    server.release();
    await waitForIdle();
    expect(getMutationRequests()).toEqual(['DELETE /api/cart/1']);
  });

  it('после изменения помечает корзину устаревшей', async () => {
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
    const { result } = render();

    act(() => result.current.addItem(1));
    await waitForIdle();

    expect(invalidateSpy).toHaveBeenCalledExactlyOnceWith({ queryKey: QUERY_KEY });
    expect(queryClient.getQueryState(QUERY_KEY)?.isInvalidated).toBe(true);
  });
});

describe('useCartActions: изменение не нужно', () => {
  it('не отправляет запрос на лимите количества', async () => {
    queryClient.setQueryData(QUERY_KEY, [{ productId: 1, quantity: MAX_ITEM_QUANTITY }]);
    const { result } = render();

    act(() => result.current.addItem(1));
    await settle();

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('не отправляет запрос при incrementItem для товара не из корзины', async () => {
    const { result } = render();

    act(() => result.current.incrementItem(9));
    await settle();

    expect(fetchMock).not.toHaveBeenCalled();
    expect(getCachedItems()).toEqual(serverItems);
  });

  it('ничего не делает, пока сессия загружается', async () => {
    session.current = { status: 'loading', user: null };
    const { result } = render();

    act(() => {
      result.current.addItem(1);
      result.current.clearCart();
    });
    await settle();

    expect(fetchMock).not.toHaveBeenCalled();
    expect(useCartStore.getState().items).toEqual([]);
  });
});

describe('useCartActions: корзина ещё не загружена', () => {
  beforeEach(() => {
    queryClient.removeQueries({ queryKey: QUERY_KEY });
  });

  it('загружает корзину и применяет изменение к ней', async () => {
    const { result } = render();

    act(() => result.current.addItem(1));
    await waitForIdle();

    expect(getRequests()).toEqual(['GET /api/cart', 'PUT /api/cart/1']);
    expect(fetchMock).toHaveBeenLastCalledWith('/api/cart/1', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: 3 }),
    });
  });

  it('не отправляет изменение, если корзина не загрузилась', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 500 }));
    const { result } = render();

    act(() => result.current.addItem(1));
    await waitFor(() => expect(getRequests()).toEqual(['GET /api/cart']));
    await settle();

    expect(getMutationRequests()).toEqual([]);
  });
});

describe('useCartActions: очистка', () => {
  it('очищает кэш до ответа сервера и отправляет DELETE', async () => {
    const server = holdMutations();
    const { result } = render();

    act(() => result.current.clearCart());

    await waitForCache([]);
    server.release();
    await waitForIdle();
    expect(getMutationRequests()).toEqual(['DELETE /api/cart']);
  });
});

describe('useCartActions: ошибка сервера', () => {
  const failMutations = () =>
    fetchMock.mockImplementation((_input, init) =>
      Promise.resolve(
        init?.method ? new Response(null, { status: 500 }) : Response.json({ items: serverItems }),
      ),
    );

  it('возвращает прежнее количество товара', async () => {
    failMutations();
    const { result } = render();

    act(() => result.current.addItem(1));
    await waitForIdle();

    expect(getCachedItems()).toEqual(serverItems);
  });

  it('возвращает корзину после неудачной очистки', async () => {
    failMutations();
    const { result } = render();

    act(() => result.current.clearCart());
    await waitForIdle();

    expect(getCachedItems()).toEqual(serverItems);
  });
});

describe('useCartActions: несколько изменений подряд', () => {
  it('отправляет изменения по очереди и инвалидирует корзину один раз в конце', async () => {
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
    const server = holdMutations();
    const { result } = render();

    act(() => result.current.addItem(1));
    await waitForCache([
      { productId: 1, quantity: 3 },
      { productId: 2, quantity: 1 },
    ]);
    act(() => result.current.addItem(1));
    await waitForCache([
      { productId: 1, quantity: 4 },
      { productId: 2, quantity: 1 },
    ]);
    act(() => result.current.decrementItem(2));
    await waitForCache([{ productId: 1, quantity: 4 }]);

    server.release();
    await waitForIdle();

    expect(getRequests()).toEqual(['PUT /api/cart/1', 'PUT /api/cart/1', 'DELETE /api/cart/2']);
    expect(invalidateSpy).toHaveBeenCalledExactlyOnceWith({ queryKey: QUERY_KEY });
  });
});
