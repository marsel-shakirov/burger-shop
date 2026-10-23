import { QueryClient } from '@tanstack/react-query';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { favoritesQueryOptions } from '../api/favorites-query-options';
import { mergeFavorites } from '../api/merge-favorites';
import { useFavoriteStore } from './favorite.store';
import type { FavoriteProductId } from './favorite.types';
import { mergeGuestFavorites } from './merge-guest-favorites';

vi.mock('../api/merge-favorites', () => ({ mergeFavorites: vi.fn() }));

vi.hoisted(() => {
  const data = new Map<string, string>();

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
});

const USER_ID = 'user-1';

const guestIds: FavoriteProductId[] = [3, 1];

const mergedIds: FavoriteProductId[] = [3, 1, 7];

const mergeFavoritesMock = vi.mocked(mergeFavorites);

let queryClient: QueryClient;

const getCachedIds = (userId = USER_ID) =>
  queryClient.getQueryData(favoritesQueryOptions(userId).queryKey);

const getGuestIds = () => useFavoriteStore.getState().productIds;

beforeEach(() => {
  queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  useFavoriteStore.setState({ productIds: guestIds });
});

afterEach(() => {
  queryClient.clear();
  vi.clearAllMocks();
});

describe('mergeGuestFavorites', () => {
  it('ничего не отправляет, если гостевое избранное пусто', async () => {
    useFavoriteStore.setState({ productIds: [] });

    await mergeGuestFavorites(queryClient, USER_ID);

    expect(mergeFavoritesMock).not.toHaveBeenCalled();
    expect(getCachedIds()).toBeUndefined();
  });

  it('отправляет гостевое избранное на сервер', async () => {
    mergeFavoritesMock.mockResolvedValue(mergedIds);

    await mergeGuestFavorites(queryClient, USER_ID);

    expect(mergeFavoritesMock).toHaveBeenCalledExactlyOnceWith(guestIds);
  });

  it('кладёт ответ сервера в кэш избранного пользователя', async () => {
    queryClient.setQueryData(favoritesQueryOptions(USER_ID).queryKey, [9]);
    mergeFavoritesMock.mockResolvedValue(mergedIds);

    await mergeGuestFavorites(queryClient, USER_ID);

    expect(getCachedIds()).toEqual(mergedIds);
  });

  it('не трогает кэш избранного другого пользователя', async () => {
    const otherIds: FavoriteProductId[] = [9];
    queryClient.setQueryData(favoritesQueryOptions('user-2').queryKey, otherIds);
    mergeFavoritesMock.mockResolvedValue(mergedIds);

    await mergeGuestFavorites(queryClient, USER_ID);

    expect(getCachedIds('user-2')).toBe(otherIds);
  });

  it('очищает гостевое избранное после успешного слияния', async () => {
    mergeFavoritesMock.mockResolvedValue(mergedIds);

    await mergeGuestFavorites(queryClient, USER_ID);

    expect(getGuestIds()).toEqual([]);
  });

  it('загрузка избранного, начатая до слияния, не перетирает его результат', async () => {
    let resolveStale: (productIds: FavoriteProductId[]) => void = () => {};
    const staleResponse = new Promise<FavoriteProductId[]>((resolve) => {
      resolveStale = resolve;
    });
    const loading = queryClient
      .query({ ...favoritesQueryOptions(USER_ID), queryFn: () => staleResponse })
      .catch(() => {});
    mergeFavoritesMock.mockResolvedValue(mergedIds);

    await mergeGuestFavorites(queryClient, USER_ID);
    resolveStale([9]);
    await loading;

    expect(getCachedIds()).toEqual(mergedIds);
  });
});

describe('mergeGuestFavorites: ошибка сервера', () => {
  it('пробрасывает ошибку', async () => {
    const error = new Error('Network error');
    mergeFavoritesMock.mockRejectedValue(error);

    await expect(mergeGuestFavorites(queryClient, USER_ID)).rejects.toBe(error);
  });

  it('сохраняет гостевое избранное', async () => {
    mergeFavoritesMock.mockRejectedValue(new Error('Network error'));

    await mergeGuestFavorites(queryClient, USER_ID).catch(() => {});

    expect(getGuestIds()).toEqual(guestIds);
  });

  it('не меняет кэш избранного пользователя', async () => {
    const cachedIds: FavoriteProductId[] = [9];
    queryClient.setQueryData(favoritesQueryOptions(USER_ID).queryKey, cachedIds);
    mergeFavoritesMock.mockRejectedValue(new Error('Network error'));

    await mergeGuestFavorites(queryClient, USER_ID).catch(() => {});

    expect(getCachedIds()).toBe(cachedIds);
  });
});
