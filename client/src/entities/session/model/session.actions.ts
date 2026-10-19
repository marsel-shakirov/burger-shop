import { useSessionStore } from './session.store';
import type { SessionUser } from './session.types';

type SessionUserListener = (user: SessionUser | null, prevUser: SessionUser | null) => void;

export const getSessionState = () => {
  const { status, user } = useSessionStore.getState();

  return { status, user };
};

export const setSessionUser = (user: SessionUser | null) =>
  useSessionStore.getState().setUser(user);

export const subscribeSessionUser = (listener: SessionUserListener) =>
  useSessionStore.subscribe((state, prevState) => {
    if (state.user !== prevState.user) {
      listener(state.user, prevState.user);
    }
  });
