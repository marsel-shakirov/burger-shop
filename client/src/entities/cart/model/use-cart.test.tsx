import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { getSessionState } from '@/entities/session/@x/cart';
import { createTestQueryClient, createWrapper } from '@/shared/testing';

import { cartQueryOptions } from '../api/cart-query-options';
import { useCartStore } from './cart.store';
import type { CartEntry } from './cart.types';
import { useCartItems, useCartTotalQuantity, useProductQuantity } from './use-cart';

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

const guestItems: CartEntry[] = [
  { productId: 1, quantity: 2 },
  { productId: 2, quantity: 1 },
];

const serverItems: CartEntry[] = [
  { productId: 5, quantity: 4 },
  { productId: 1, quantity: 1 },
];

const fetchMock = vi.fn<typeof fetch>();

let queryClient = createTestQueryClient();

const render = <T,>(hook: () => T) => renderHook(hook, { wrapper: createWrapper({ queryClient }) });

const signIn = () => {
  session.current = { status: 'authenticated', user: USER };
};

beforeEach(() => {
  queryClient = createTestQueryClient();
  session.current = { status: 'guest', user: null };
  useCartStore.setState({ items: guestItems });
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  queryClient.clear();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe('useCartItems: гость', () => {
  it('возвращает гостевую корзину без загрузки', () => {
    const { result } = render(useCartItems);

    expect(result.current).toMatchObject({ items: guestItems, isPending: false, isError: false });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('обновляется при изменении гостевой корзины', () => {
    const { result } = render(useCartItems);

    act(() => useCartStore.getState().addItem(7));

    expect(result.current.items).toEqual([{ productId: 7, quantity: 1 }, ...guestItems]);
  });
});

describe('useCartItems: сессия загружается', () => {
  it('возвращает пустую корзину в состоянии загрузки и ничего не запрашивает', () => {
    session.current = { status: 'loading', user: null };

    const { result } = render(useCartItems);

    expect(result.current).toMatchObject({ items: [], isPending: true, isError: false });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('useCartItems: авторизованный пользователь', () => {
  it('берёт корзину из кэша пользователя, а не из гостевого стора', () => {
    signIn();
    queryClient.setQueryData(cartQueryOptions(USER.id).queryKey, serverItems);

    const { result } = render(useCartItems);

    expect(result.current).toMatchObject({ items: serverItems, isPending: false, isError: false });
  });

  it('загружает корзину с сервера', async () => {
    signIn();
    fetchMock.mockResolvedValue(Response.json({ items: serverItems }));

    const { result } = render(useCartItems);

    expect(result.current.isPending).toBe(true);
    await waitFor(() => expect(result.current.isPending).toBe(false));
    expect(result.current.items).toEqual(serverItems);
    expect(fetchMock).toHaveBeenCalledWith('/api/cart', expect.anything());
  });

  it('сообщает об ошибке загрузки', async () => {
    signIn();
    fetchMock.mockResolvedValue(new Response(null, { status: 500 }));

    const { result } = render(useCartItems);

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.items).toEqual([]);
  });

  it('refetch после ошибки загружает корзину снова', async () => {
    signIn();
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 500 }));
    fetchMock.mockResolvedValueOnce(Response.json({ items: serverItems }));
    const { result } = render(useCartItems);
    await waitFor(() => expect(result.current.isError).toBe(true));

    act(() => result.current.refetch());

    await waitFor(() => expect(result.current.items).toEqual(serverItems));
    expect(result.current.isError).toBe(false);
  });
});

describe('useCartItems: refetch без сессии', () => {
  it.each(['guest', 'loading'] as const)('для статуса %s ничего не запрашивает', (status) => {
    session.current = { status, user: null };
    const { result } = render(useCartItems);

    act(() => result.current.refetch());

    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('useCartTotalQuantity', () => {
  it('считает общее количество гостевой корзины', () => {
    const { result } = render(useCartTotalQuantity);

    expect(result.current.totalQuantity).toBe(3);
  });

  it('считает общее количество корзины пользователя', () => {
    signIn();
    queryClient.setQueryData(cartQueryOptions(USER.id).queryKey, serverItems);

    const { result } = render(useCartTotalQuantity);

    expect(result.current.totalQuantity).toBe(5);
  });

  it('возвращает 0, пока сессия загружается', () => {
    session.current = { status: 'loading', user: null };

    const { result } = render(useCartTotalQuantity);

    expect(result.current).toEqual({ totalQuantity: 0, isPending: true, isError: false });
  });
});

describe('useProductQuantity', () => {
  it('возвращает количество товара в гостевой корзине', () => {
    const { result } = render(() => useProductQuantity(1));

    expect(result.current.quantity).toBe(2);
  });

  it('возвращает количество товара в корзине пользователя', () => {
    signIn();
    queryClient.setQueryData(cartQueryOptions(USER.id).queryKey, serverItems);

    const { result } = render(() => useProductQuantity(5));

    expect(result.current.quantity).toBe(4);
  });

  it('возвращает 0 для товара не из корзины', () => {
    const { result } = render(() => useProductQuantity(99));

    expect(result.current.quantity).toBe(0);
  });
});
