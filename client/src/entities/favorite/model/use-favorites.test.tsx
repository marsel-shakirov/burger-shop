import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { getSessionState } from '@/entities/session/@x/favorite';
import { createTestQueryClient, createWrapper } from '@/shared/testing';

import { favoritesQueryOptions } from '../api/favorites-query-options';
import { useFavoriteStore } from './favorite.store';
import { useFavoriteIds, useFavoritesCount, useIsFavorite } from './use-favorites';

const session = vi.hoisted(() => {
  const current: ReturnType<typeof getSessionState> = { status: 'guest', user: null };

  return { current };
});

vi.mock('@/entities/session/@x/favorite', () => ({
  useSessionStatus: () => session.current.status,
  useSessionUser: () => session.current.user,
  getSessionState: () => session.current,
}));

const USER = { id: 'user-1', email: 'user@example.com' };

const guestIds = [3, 1];

const serverIds = [7, 5, 3];

const fetchMock = vi.fn<typeof fetch>();

let queryClient = createTestQueryClient();

const render = <T,>(hook: () => T) => renderHook(hook, { wrapper: createWrapper({ queryClient }) });

const signIn = () => {
  session.current = { status: 'authenticated', user: USER };
};

const seedServerIds = () =>
  queryClient.setQueryData(favoritesQueryOptions(USER.id).queryKey, serverIds);

beforeEach(() => {
  queryClient = createTestQueryClient();
  session.current = { status: 'guest', user: null };
  useFavoriteStore.setState({ productIds: guestIds });
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  queryClient.clear();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe('useFavoriteIds: гость', () => {
  it('возвращает гостевое избранное без загрузки', () => {
    const { result } = render(useFavoriteIds);

    expect(result.current).toEqual({ productIds: guestIds, isPending: false, isError: false });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('обновляется при изменении гостевого избранного', () => {
    const { result } = render(useFavoriteIds);

    act(() => useFavoriteStore.getState().toggleFavorite(9));

    expect(result.current.productIds).toEqual([9, ...guestIds]);
  });
});

describe('useFavoriteIds: сессия загружается', () => {
  it('возвращает пустой список в состоянии загрузки и ничего не запрашивает', () => {
    session.current = { status: 'loading', user: null };

    const { result } = render(useFavoriteIds);

    expect(result.current).toEqual({ productIds: [], isPending: true, isError: false });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('useFavoriteIds: авторизованный пользователь', () => {
  it('берёт избранное из кэша пользователя, а не из гостевого стора', () => {
    signIn();
    seedServerIds();

    const { result } = render(useFavoriteIds);

    expect(result.current).toEqual({ productIds: serverIds, isPending: false, isError: false });
  });

  it('загружает избранное с сервера', async () => {
    signIn();
    fetchMock.mockResolvedValue(Response.json({ productIds: serverIds }));

    const { result } = render(useFavoriteIds);

    expect(result.current.isPending).toBe(true);
    await waitFor(() => expect(result.current.isPending).toBe(false));
    expect(result.current.productIds).toEqual(serverIds);
    expect(fetchMock).toHaveBeenCalledWith('/api/favorites', expect.anything());
  });

  it('сообщает об ошибке загрузки', async () => {
    signIn();
    fetchMock.mockResolvedValue(new Response(null, { status: 500 }));

    const { result } = render(useFavoriteIds);

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.productIds).toEqual([]);
  });
});

describe('useFavoritesCount', () => {
  it('считает гостевое избранное', () => {
    const { result } = render(useFavoritesCount);

    expect(result.current.count).toBe(2);
  });

  it('считает избранное пользователя', () => {
    signIn();
    seedServerIds();

    const { result } = render(useFavoritesCount);

    expect(result.current.count).toBe(3);
  });

  it('возвращает 0, пока сессия загружается', () => {
    session.current = { status: 'loading', user: null };

    const { result } = render(useFavoritesCount);

    expect(result.current).toEqual({ count: 0, isPending: true, isError: false });
  });
});

describe('useIsFavorite', () => {
  it('проверяет товар в гостевом избранном', () => {
    expect(render(() => useIsFavorite(3)).result.current.isFavorite).toBe(true);
    expect(render(() => useIsFavorite(7)).result.current.isFavorite).toBe(false);
  });

  it('проверяет товар в избранном пользователя', () => {
    signIn();
    seedServerIds();

    expect(render(() => useIsFavorite(7)).result.current.isFavorite).toBe(true);
    expect(render(() => useIsFavorite(1)).result.current.isFavorite).toBe(false);
  });

  it('возвращает false, пока сессия загружается', () => {
    session.current = { status: 'loading', user: null };

    const { result } = render(() => useIsFavorite(3));

    expect(result.current).toEqual({ isFavorite: false, isPending: true, isError: false });
  });
});
