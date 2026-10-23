import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getSessionState, setSessionUser, subscribeSessionUser } from './session.actions';
import { useSessionStore } from './session.store';
import type { SessionUser } from './session.types';

const user: SessionUser = { id: 'user-1', email: 'user@example.com' };

const otherUser: SessionUser = { id: 'user-2', email: 'other@example.com' };

const unsubscribers: Array<() => void> = [];

const subscribe = (listener: Parameters<typeof subscribeSessionUser>[0]) => {
  const unsubscribe = subscribeSessionUser(listener);
  unsubscribers.push(unsubscribe);
  return unsubscribe;
};

beforeEach(() => {
  useSessionStore.setState(useSessionStore.getInitialState(), true);
});

afterEach(() => {
  unsubscribers.splice(0).forEach((unsubscribe) => unsubscribe());
});

describe('getSessionState', () => {
  it('возвращает только статус и пользователя', () => {
    expect(getSessionState()).toEqual({ status: 'loading', user: null });
  });

  it('отражает текущее состояние стора', () => {
    useSessionStore.getState().setUser(user);

    expect(getSessionState()).toEqual({ status: 'authenticated', user });
  });
});

describe('setSessionUser', () => {
  it('записывает пользователя в стор', () => {
    setSessionUser(user);

    expect(useSessionStore.getState()).toMatchObject({ user, status: 'authenticated' });
  });

  it('null переводит сессию в статус guest', () => {
    setSessionUser(user);
    setSessionUser(null);

    expect(useSessionStore.getState()).toMatchObject({ user: null, status: 'guest' });
  });
});

describe('subscribeSessionUser', () => {
  it('вызывает слушателя с новым и предыдущим пользователем при входе', () => {
    const listener = vi.fn();
    subscribe(listener);

    setSessionUser(user);

    expect(listener).toHaveBeenCalledExactlyOnceWith(user, null);
  });

  it('вызывает слушателя при смене пользователя и при выходе', () => {
    const listener = vi.fn();
    setSessionUser(user);
    subscribe(listener);

    setSessionUser(otherUser);
    setSessionUser(null);

    expect(listener.mock.calls).toEqual([
      [otherUser, user],
      [null, otherUser],
    ]);
  });

  it('не вызывает слушателя, если пользователь не изменился', () => {
    const listener = vi.fn();
    setSessionUser(user);
    subscribe(listener);

    setSessionUser(user);

    expect(listener).not.toHaveBeenCalled();
  });

  it('не вызывает слушателя при первом статусе guest, где пользователь остаётся null', () => {
    const listener = vi.fn();
    subscribe(listener);

    setSessionUser(null);

    expect(listener).not.toHaveBeenCalled();
  });

  it('сравнивает пользователя по ссылке: копия с тем же id считается сменой', () => {
    const listener = vi.fn();
    setSessionUser(user);
    subscribe(listener);

    setSessionUser({ ...user });

    expect(listener).toHaveBeenCalledOnce();
  });

  it('после отписки слушатель больше не вызывается', () => {
    const listener = vi.fn();
    const unsubscribe = subscribe(listener);

    unsubscribe();
    setSessionUser(user);

    expect(listener).not.toHaveBeenCalled();
  });
});
