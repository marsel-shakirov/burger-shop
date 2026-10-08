import type { SessionUser } from './auth.types.ts';

export function toSessionUser({ id, email }: { id: string; email?: string }): SessionUser {
  return { id, email: email ?? null };
}
