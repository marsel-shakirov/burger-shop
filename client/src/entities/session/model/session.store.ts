import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import type { SessionState } from './session.types';

export const useSessionStore = create<SessionState>()(
  devtools(
    (set) => ({
      session: null,
      status: 'loading',
      setSession: (session) => set({ session, status: session ? 'authenticated' : 'guest' }),
    }),
    { name: 'session-store' },
  ),
);
