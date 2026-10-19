export type SessionStatus = 'loading' | 'authenticated' | 'guest';

export interface SessionUser {
  id: string;
  email: string | null;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SessionState {
  user: SessionUser | null;
  status: SessionStatus;
  setUser: (user: SessionUser | null) => void;
}
