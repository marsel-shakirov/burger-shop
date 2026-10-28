import { vi } from 'vitest';

import type { StatelessSupabase, Supabase } from '../supabase.ts';

type AuthMethodMock = (...args: unknown[]) => Promise<unknown>;

const authMethod = (result?: unknown) =>
  vi.fn<AuthMethodMock>(result === undefined ? undefined : async () => result);

function createAuthMock() {
  return {
    getClaims: authMethod(),
    signInWithPassword: authMethod(),
    signUp: authMethod(),
    signOut: authMethod({ error: null }),
    updateUser: authMethod({ data: { user: {} }, error: null }),
    exchangeCodeForSession: authMethod({ data: {}, error: null }),
  };
}

export function createSupabaseMock() {
  const auth = createAuthMock();

  return { auth, client: { auth } as unknown as Supabase };
}

export function createStatelessSupabaseMock() {
  const auth = createAuthMock();

  return { auth, client: { auth } as unknown as StatelessSupabase };
}

export const claimsResult = (claims: { sub: string; email?: string }) => ({
  data: { claims },
  error: null,
});

export const noClaimsResult = () => ({ data: null, error: null });
