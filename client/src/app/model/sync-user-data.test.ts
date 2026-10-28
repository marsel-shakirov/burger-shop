import { QueryClient } from '@tanstack/react-query';
import { afterEach, beforeEach, describe, expect, it, type MockInstance, vi } from 'vitest';

import { bonusQueryOptions } from '@/entities/bonus';
import { cartQueryOptions, type mergeGuestCart } from '@/entities/cart';
import { favoritesQueryOptions, type mergeGuestFavorites } from '@/entities/favorite';
import { profileQueryOptions } from '@/entities/profile';
import type { SessionUser } from '@/entities/session';

import { syncUserData } from './sync-user-data';

const mocks = vi.hoisted(() => ({
  mergeGuestCart: vi.fn<typeof mergeGuestCart>(),
  mergeGuestFavorites: vi.fn<typeof mergeGuestFavorites>(),
  untracked: <T>(promise: Promise<T>) =>
    new Promise<T>((resolve, reject) => {
      promise.then(resolve, reject);
    }),
}));

vi.mock('@/entities/cart', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  mergeGuestCart: (...args: Parameters<typeof mergeGuestCart>) =>
    mocks.untracked(mocks.mergeGuestCart(...args)),
}));

vi.mock('@/entities/favorite', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  mergeGuestFavorites: (...args: Parameters<typeof mergeGuestFavorites>) =>
    mocks.untracked(mocks.mergeGuestFavorites(...args)),
}));

interface TestProcess {
  on: (event: 'unhandledRejection', listener: (reason: unknown) => void) => void;
  off: (event: 'unhandledRejection', listener: (reason: unknown) => void) => void;
}

const { process } = globalThis as unknown as { process: TestProcess };

const user: SessionUser = { id: 'user-1', email: 'user@example.com' };

const otherUser: SessionUser = { id: 'user-2', email: 'other@example.com' };

const USER_QUERY_OPTIONS = [
  profileQueryOptions,
  favoritesQueryOptions,
  cartQueryOptions,
  bonusQueryOptions,
];

const getUserQueryKeys = (userId: string) =>
  USER_QUERY_OPTIONS.map((options) => options(userId).queryKey);

const PRODUCTS_QUERY_KEY = ['products'];

const mergeGuestCartMock = mocks.mergeGuestCart;

const mergeGuestFavoritesMock = mocks.mergeGuestFavorites;

let queryClient: QueryClient;

let queryMock: MockInstance<QueryClient['query']>;

const seedQueries = (userId: string) => {
  getUserQueryKeys(userId).forEach((queryKey) => queryClient.setQueryData(queryKey, []));
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

    getUserQueryKeys(user.id).forEach((queryKey) => expect(hasQuery(queryKey)).toBe(true));
  });
});

describe('syncUserData: выход', () => {
  it('удаляет кэш профиля, избранного, корзины и бонусов', () => {
    seedQueries(user.id);

    syncUserData(queryClient, null, user);

    getUserQueryKeys(user.id).forEach((queryKey) => expect(hasQuery(queryKey)).toBe(false));
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

    getUserQueryKeys(user.id).forEach((queryKey) => expect(hasQuery(queryKey)).toBe(false));
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

    getUserQueryKeys(user.id).forEach((queryKey) => expect(hasQuery(queryKey)).toBe(true));
    expect(queryMock).not.toHaveBeenCalled();
    expect(mergeGuestCartMock).not.toHaveBeenCalled();
  });

  it('ничего не делает, если гость остался гостем', () => {
    seedQueries(user.id);

    syncUserData(queryClient, null, null);

    expect(hasQuery(cartQueryOptions(user.id).queryKey)).toBe(true);
    expect(queryMock).not.toHaveBeenCalled();
    expect(mergeGuestCartMock).not.toHaveBeenCalled();
  });
});

describe('syncUserData: ошибки', () => {
  it('гасит ошибки загрузки и слияния', async () => {
    const onUnhandledRejection = vi.fn();
    process.on('unhandledRejection', onUnhandledRejection);
    queryMock.mockRestore();
    queryClient.setDefaultOptions({ queries: { retry: false } });
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    mergeGuestCartMock.mockRejectedValue(new Error('Network error'));
    mergeGuestFavoritesMock.mockRejectedValue(new Error('Network error'));

    syncUserData(queryClient, user, null);
    await new Promise((resolve) => setTimeout(resolve, 10));
    process.off('unhandledRejection', onUnhandledRejection);
    vi.unstubAllGlobals();

    expect(onUnhandledRejection).not.toHaveBeenCalled();
  });
});
