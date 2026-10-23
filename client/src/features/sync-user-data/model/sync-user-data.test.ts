import { QueryClient } from '@tanstack/react-query';
import { afterEach, beforeEach, describe, expect, it, type MockInstance, vi } from 'vitest';

import { BONUS_QUERY_KEY } from '@/entities/bonus';
import { CART_QUERY_KEY, cartQueryOptions, mergeGuestCart } from '@/entities/cart';
import {
  FAVORITES_QUERY_KEY,
  favoritesQueryOptions,
  mergeGuestFavorites,
} from '@/entities/favorite';
import { PROFILE_QUERY_KEY } from '@/entities/profile';
import type { SessionUser } from '@/entities/session';

import { syncUserData } from './sync-user-data';

vi.mock('@/entities/cart', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  mergeGuestCart: vi.fn(),
}));

vi.mock('@/entities/favorite', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  mergeGuestFavorites: vi.fn(),
}));

const user: SessionUser = { id: 'user-1', email: 'user@example.com' };

const otherUser: SessionUser = { id: 'user-2', email: 'other@example.com' };

const USER_QUERY_KEYS = [PROFILE_QUERY_KEY, FAVORITES_QUERY_KEY, CART_QUERY_KEY, BONUS_QUERY_KEY];

const PRODUCTS_QUERY_KEY = ['products'];

const mergeGuestCartMock = vi.mocked(mergeGuestCart);

const mergeGuestFavoritesMock = vi.mocked(mergeGuestFavorites);

let queryClient: QueryClient;

let queryMock: MockInstance<QueryClient['query']>;

const seedQueries = (userId: string) => {
  USER_QUERY_KEYS.forEach((key) => queryClient.setQueryData([...key, userId], []));
  queryClient.setQueryData(PRODUCTS_QUERY_KEY, []);
};

const hasQuery = (queryKey: readonly unknown[]) => queryClient.getQueryData(queryKey) !== undefined;

const getQueriedKeys = () => queryMock.mock.calls.map(([options]) => options.queryKey);

beforeEach(() => {
  queryClient = new QueryClient();
  queryMock = vi.spyOn(queryClient, 'query').mockResolvedValue(undefined);
  mergeGuestCartMock.mockResolvedValue(undefined);
  mergeGuestFavoritesMock.mockResolvedValue(undefined);
});

afterEach(() => {
  queryClient.clear();
  vi.clearAllMocks();
});

describe('syncUserData: вход', () => {
  it('загружает избранное и корзину пользователя', () => {
    syncUserData(queryClient, user, null);

    expect(getQueriedKeys()).toEqual([
      favoritesQueryOptions(user.id).queryKey,
      cartQueryOptions(user.id).queryKey,
    ]);
  });

  it('сливает гостевые избранное и корзину в аккаунт пользователя', () => {
    syncUserData(queryClient, user, null);

    expect(mergeGuestFavoritesMock).toHaveBeenCalledExactlyOnceWith(queryClient, user.id);
    expect(mergeGuestCartMock).toHaveBeenCalledExactlyOnceWith(queryClient, user.id);
  });

  it('не удаляет кэш', () => {
    seedQueries(user.id);

    syncUserData(queryClient, user, null);

    USER_QUERY_KEYS.forEach((key) => expect(hasQuery([...key, user.id])).toBe(true));
  });
});

describe('syncUserData: выход', () => {
  it('удаляет кэш профиля, избранного, корзины и бонусов', () => {
    seedQueries(user.id);

    syncUserData(queryClient, null, user);

    USER_QUERY_KEYS.forEach((key) => expect(hasQuery([...key, user.id])).toBe(false));
  });

  it('не трогает кэш, не связанный с пользователем', () => {
    seedQueries(user.id);

    syncUserData(queryClient, null, user);

    expect(hasQuery(PRODUCTS_QUERY_KEY)).toBe(true);
  });

  it('ничего не загружает и не сливает', () => {
    syncUserData(queryClient, null, user);

    expect(queryMock).not.toHaveBeenCalled();
    expect(mergeGuestFavoritesMock).not.toHaveBeenCalled();
    expect(mergeGuestCartMock).not.toHaveBeenCalled();
  });
});

describe('syncUserData: смена пользователя', () => {
  it('удаляет кэш предыдущего пользователя', () => {
    seedQueries(user.id);

    syncUserData(queryClient, otherUser, user);

    USER_QUERY_KEYS.forEach((key) => expect(hasQuery([...key, user.id])).toBe(false));
  });

  it('загружает и сливает данные нового пользователя', () => {
    syncUserData(queryClient, otherUser, user);

    expect(getQueriedKeys()).toEqual([
      favoritesQueryOptions(otherUser.id).queryKey,
      cartQueryOptions(otherUser.id).queryKey,
    ]);
    expect(mergeGuestFavoritesMock).toHaveBeenCalledExactlyOnceWith(queryClient, otherUser.id);
    expect(mergeGuestCartMock).toHaveBeenCalledExactlyOnceWith(queryClient, otherUser.id);
  });
});

describe('syncUserData: пользователь не сменился', () => {
  it('не трогает кэш и ничего не загружает, если изменился только email', () => {
    seedQueries(user.id);

    syncUserData(queryClient, { ...user, email: 'new@example.com' }, user);

    USER_QUERY_KEYS.forEach((key) => expect(hasQuery([...key, user.id])).toBe(true));
    expect(queryMock).not.toHaveBeenCalled();
    expect(mergeGuestCartMock).not.toHaveBeenCalled();
  });

  it('ничего не делает, если гость остался гостем', () => {
    seedQueries(user.id);

    syncUserData(queryClient, null, null);

    expect(hasQuery([...CART_QUERY_KEY, user.id])).toBe(true);
    expect(queryMock).not.toHaveBeenCalled();
    expect(mergeGuestCartMock).not.toHaveBeenCalled();
  });
});
