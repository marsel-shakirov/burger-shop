import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { getSessionState } from '@/entities/session/@x/favorite';
import { createTestQueryClient, createWrapper } from '@/shared/testing';

import { favoritesQueryOptions } from '../api/favorites-query-options';
import { useFavoriteStore } from './favorite.store';
import type { FavoriteProductId } from './favorite.types';
import { useFavoriteActions } from './use-favorite-actions';

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

const QUERY_KEY = favoritesQueryOptions(USER.id).queryKey;

const serverIds: FavoriteProductId[] = [3, 1];

const fetchMock = vi.fn<typeof fetch>();

let queryClient = createTestQueryClient();

const render = () => renderHook(useFavoriteActions, { wrapper: createWrapper({ queryClient }) });

const getCachedIds = () => queryClient.getQueryData(QUERY_KEY);

const getRequests = () =>
  fetchMock.mock.calls.map(([input, init]) => `${init?.method ?? 'GET'} ${input as string}`);

const respondWith = (status: number) =>
  fetchMock.mockImplementation(() => Promise.resolve(new Response(null, { status })));

const holdMutations = () => {
  const pending: Array<() => void> = [];

  fetchMock.mockImplementation(
    () =>
      new Promise((resolve) => pending.push(() => resolve(new Response(null, { status: 204 })))),
  );

  return {
    release: () => {
      respondWith(204);
      pending.splice(0).forEach((resolve) => resolve());
    },
  };
};

const waitForCache = (productIds: FavoriteProductId[]) =>
  waitFor(() => expect(getCachedIds()).toEqual(productIds));

const waitForIdle = () =>
  waitFor(() => {
    expect(queryClient.getMutationCache().getAll()).not.toHaveLength(0);
    expect(queryClient.isMutating()).toBe(0);
  });

const settle = () => act(() => new Promise<void>((resolve) => setTimeout(resolve)));

beforeEach(() => {
  queryClient = createTestQueryClient();
  session.current = { status: 'authenticated', user: USER };
  queryClient.setQueryData(QUERY_KEY, serverIds);
  useFavoriteStore.setState({ productIds: [] });
  vi.stubGlobal('fetch', fetchMock);
  respondWith(204);
});

afterEach(() => {
  queryClient.clear();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe('useFavoriteActions: гость', () => {
  it('переключает гостевое избранное и ничего не отправляет', () => {
    session.current = { status: 'guest', user: null };
    const { result } = render();

    act(() => {
      result.current.toggleFavorite(5);
      result.current.toggleFavorite(7);
      result.current.toggleFavorite(5);
    });

    expect(useFavoriteStore.getState().productIds).toEqual([7]);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('useFavoriteActions: авторизованный пользователь', () => {
  it('добавляет товар в кэш до ответа сервера и отправляет PUT', async () => {
    const server = holdMutations();
    const { result } = render();

    act(() => result.current.toggleFavorite(7));

    await waitForCache([7, 3, 1]);
    server.release();
    await waitForIdle();
    expect(getRequests()).toEqual(['PUT /api/favorites/7']);
  });

  it('убирает товар из кэша до ответа сервера и отправляет DELETE', async () => {
    const server = holdMutations();
    const { result } = render();

    act(() => result.current.toggleFavorite(3));

    await waitForCache([1]);
    server.release();
    await waitForIdle();
    expect(getRequests()).toEqual(['DELETE /api/favorites/3']);
  });

  it('ничего не делает, пока сессия загружается', async () => {
    session.current = { status: 'loading', user: null };
    const { result } = render();

    act(() => result.current.toggleFavorite(7));
    await settle();

    expect(fetchMock).not.toHaveBeenCalled();
    expect(useFavoriteStore.getState().productIds).toEqual([]);
  });
});

describe('useFavoriteActions: избранное ещё не загружено', () => {
  beforeEach(() => {
    queryClient.removeQueries({ queryKey: QUERY_KEY });
    fetchMock.mockImplementation((_input, init) =>
      Promise.resolve(
        init?.method
          ? new Response(null, { status: 204 })
          : Response.json({ productIds: serverIds }),
      ),
    );
  });

  it('загружает избранное и убирает товар, который уже в нём', async () => {
    const { result } = render();

    act(() => result.current.toggleFavorite(3));
    await waitForIdle();

    expect(getRequests()).toEqual(['GET /api/favorites', 'DELETE /api/favorites/3']);
  });

  it('загружает избранное и добавляет товар, которого в нём нет', async () => {
    const { result } = render();

    act(() => result.current.toggleFavorite(7));
    await waitForIdle();

    expect(getRequests()).toEqual(['GET /api/favorites', 'PUT /api/favorites/7']);
  });

  it('ничего не отправляет, если избранное не загрузилось', async () => {
    respondWith(500);
    const { result } = render();

    act(() => result.current.toggleFavorite(7));
    await waitFor(() => expect(getRequests()).toEqual(['GET /api/favorites']));
    await settle();

    expect(getRequests()).toEqual(['GET /api/favorites']);
  });
});

describe('useFavoriteActions: ошибка сервера', () => {
  it('убирает товар после неудачного добавления', async () => {
    respondWith(500);
    const { result } = render();

    act(() => result.current.toggleFavorite(7));
    await waitForIdle();

    expect(getCachedIds()).toEqual(serverIds);
  });

  it('возвращает товар после неудачного удаления', async () => {
    respondWith(500);
    const { result } = render();

    act(() => result.current.toggleFavorite(1));
    await waitForIdle();

    expect(getCachedIds()).toEqual(expect.arrayContaining(serverIds));
    expect(getCachedIds()).toHaveLength(serverIds.length);
  });
});

describe('useFavoriteActions: несколько переключений подряд', () => {
  it('отправляет их по очереди и инвалидирует избранное один раз в конце', async () => {
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
    const server = holdMutations();
    const { result } = render();

    act(() => result.current.toggleFavorite(7));
    await waitForCache([7, 3, 1]);
    act(() => result.current.toggleFavorite(7));
    await waitForCache([3, 1]);

    server.release();
    await waitForIdle();

    expect(getRequests()).toEqual(['PUT /api/favorites/7', 'DELETE /api/favorites/7']);
    expect(invalidateSpy).toHaveBeenCalledExactlyOnceWith({ queryKey: QUERY_KEY });
  });
});
