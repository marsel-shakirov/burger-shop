import { beforeEach, describe, expect, it } from 'vitest';

import { claimsResult, createSupabaseMock, noClaimsResult } from '../../testing/supabase-mock.ts';
import { getSessionUseCase } from './get-session.use-case.ts';

let supabase: ReturnType<typeof createSupabaseMock>;

beforeEach(() => {
  supabase = createSupabaseMock();
});

describe('getSessionUseCase', () => {
  it('возвращает пользователя из claims', async () => {
    supabase.auth.getClaims.mockResolvedValue(
      claimsResult({ sub: 'user-1', email: 'user@example.com' }),
    );

    await expect(getSessionUseCase(supabase.client)).resolves.toEqual({
      id: 'user-1',
      email: 'user@example.com',
    });
  });

  it('возвращает пользователя без email, если его нет в claims', async () => {
    supabase.auth.getClaims.mockResolvedValue(claimsResult({ sub: 'user-1' }));

    await expect(getSessionUseCase(supabase.client)).resolves.toEqual({
      id: 'user-1',
      email: null,
    });
  });

  it('возвращает null без сессии', async () => {
    supabase.auth.getClaims.mockResolvedValue(noClaimsResult());

    await expect(getSessionUseCase(supabase.client)).resolves.toBeNull();
  });
});
