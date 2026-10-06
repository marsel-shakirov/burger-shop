import { useQueryClient } from '@tanstack/react-query';
import { type PropsWithChildren, useEffect } from 'react';

import { useSessionStore } from '@/entities/session';
import { supabase } from '@/shared/api';

export function SessionProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      useSessionStore.getState().setSession(session);

      if (event === 'SIGNED_OUT') {
        queryClient.removeQueries({ queryKey: ['profile'] });
      }
    });

    return () => data.subscription.unsubscribe();
  }, [queryClient]);

  return children;
}
