import { useQueryClient } from '@tanstack/react-query';
import { type PropsWithChildren, useEffect } from 'react';

import { cartQueryOptions, mergeGuestCart } from '@/entities/cart';
import { favoritesQueryOptions, mergeGuestFavorites } from '@/entities/favorite';
import { getSession, type SessionUser, useSessionStore } from '@/entities/session';
import { onUnauthorized } from '@/shared/api';

const SESSION_CHANNEL_NAME = 'session';

const isSameUser = (a: SessionUser | null, b: SessionUser | null) =>
  a?.id === b?.id && a?.email === b?.email;

export function SessionProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const controller = new AbortController();
    const channel = new BroadcastChannel(SESSION_CHANNEL_NAME);
    const { setUser } = useSessionStore.getState();
    let isRemoteUpdate = false;

    const syncUser = (user: SessionUser | null) => {
      const { user: currentUser, status } = useSessionStore.getState();

      if (status !== 'loading' && isSameUser(user, currentUser)) return;

      setUser(user);
    };

    getSession({ signal: controller.signal })
      .then(setUser)
      .catch(() => {
        if (!controller.signal.aborted) {
          setUser(null);
        }
      });

    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible') return;

      const userAtStart = useSessionStore.getState().user;

      getSession({ signal: controller.signal })
        .then((user) => {
          if (useSessionStore.getState().user !== userAtStart) return;
          syncUser(user);
        })
        .catch(() => {});
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    channel.onmessage = (event: MessageEvent<SessionUser | null>) => {
      isRemoteUpdate = true;
      syncUser(event.data);
      isRemoteUpdate = false;
    };

    const unsubscribeUnauthorized = onUnauthorized(() => setUser(null));

    const unsubscribeStore = useSessionStore.subscribe((state, prevState) => {
      if (prevState.user && state.user?.id !== prevState.user.id) {
        queryClient.removeQueries({ queryKey: ['profile'] });
        queryClient.removeQueries({ queryKey: ['favorites'] });
        queryClient.removeQueries({ queryKey: ['cart'] });
      }

      if (state.user && state.user.id !== prevState.user?.id) {
        queryClient.query(favoritesQueryOptions(state.user.id)).catch(() => {});
        mergeGuestFavorites(queryClient, state.user.id).catch(() => {});
        queryClient.query(cartQueryOptions(state.user.id)).catch(() => {});
        mergeGuestCart(queryClient, state.user.id).catch(() => {});
      }

      if (!isRemoteUpdate && !isSameUser(state.user, prevState.user)) {
        channel.postMessage(state.user);
      }
    });

    return () => {
      controller.abort();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      channel.close();
      unsubscribeUnauthorized();
      unsubscribeStore();
    };
  }, [queryClient]);

  return children;
}
