import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import type { SessionState } from './session.types';

export const useSessionStore = create<SessionState>()(
  devtools(
    (set) => ({
      user: null,
      status: 'loading',
      setUser: (user) => set({ user, status: user ? 'authenticated' : 'guest' }),
    }),
    { name: 'session-store' },
  ),
);
