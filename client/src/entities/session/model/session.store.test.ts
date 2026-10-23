import { beforeEach, describe, expect, it } from 'vitest';

import { useSessionStore } from './session.store';
import type { SessionUser } from './session.types';

const user: SessionUser = { id: 'user-1', email: 'user@example.com' };

beforeEach(() => {
  useSessionStore.setState(useSessionStore.getInitialState(), true);
});

describe('useSessionStore', () => {
  it('стартует без пользователя в статусе loading', () => {
    expect(useSessionStore.getState()).toMatchObject({ user: null, status: 'loading' });
  });

  it('setUser с пользователем ставит статус authenticated', () => {
    useSessionStore.getState().setUser(user);

    expect(useSessionStore.getState()).toMatchObject({ user, status: 'authenticated' });
  });

  it('setUser(null) ставит статус guest', () => {
    useSessionStore.getState().setUser(null);

    expect(useSessionStore.getState()).toMatchObject({ user: null, status: 'guest' });
  });

  it('выход после входа сбрасывает пользователя и ставит статус guest', () => {
    useSessionStore.getState().setUser(user);
    useSessionStore.getState().setUser(null);

    expect(useSessionStore.getState()).toMatchObject({ user: null, status: 'guest' });
  });

  it('принимает пользователя без email', () => {
    const userWithoutEmail: SessionUser = { id: 'user-2', email: null };

    useSessionStore.getState().setUser(userWithoutEmail);

    expect(useSessionStore.getState()).toMatchObject({
      user: userWithoutEmail,
      status: 'authenticated',
    });
  });
});
