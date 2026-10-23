import type { SessionUser } from '../model/session.types';

export const isSameUser = (a: SessionUser | null, b: SessionUser | null) =>
  a?.id === b?.id && a?.email === b?.email;
