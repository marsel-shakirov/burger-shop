import { useQueryClient } from '@tanstack/react-query';
import { type PropsWithChildren, useEffect } from 'react';

import { getSession, useSessionStore } from '@/entities/session';
import { onUnauthorized } from '@/shared/api';

export function SessionProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const controller = new AbortController();
    const { setUser } = useSessionStore.getState();

    getSession({ signal: controller.signal })
      .then(setUser)
      .catch(() => {
        if (!controller.signal.aborted) {
          setUser(null);
        }
      });

    const unsubscribeUnauthorized = onUnauthorized(() => setUser(null));

    const unsubscribeStore = useSessionStore.subscribe((state, prevState) => {
      if (prevState.user && !state.user) {
        queryClient.removeQueries({ queryKey: ['profile'] });
      }
    });

    return () => {
      controller.abort();
      unsubscribeUnauthorized();
      unsubscribeStore();
    };
  }, [queryClient]);

  return children;
}
