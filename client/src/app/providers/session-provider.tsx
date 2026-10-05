import { type PropsWithChildren, useEffect } from 'react';

import { useSessionStore } from '@/entities/session';
import { supabase } from '@/shared/api';

export function SessionProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      useSessionStore.getState().setSession(session);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  return children;
}
