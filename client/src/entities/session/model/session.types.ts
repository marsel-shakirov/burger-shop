import type { Session } from '@supabase/supabase-js';

export type SessionStatus = 'loading' | 'authenticated' | 'guest';

export interface SessionState {
  session: Session | null;
  status: SessionStatus;
  setSession: (session: Session | null) => void;
}
