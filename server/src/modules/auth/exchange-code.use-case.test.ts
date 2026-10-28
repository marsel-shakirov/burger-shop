import { AuthApiError } from '@supabase/supabase-js';
import { beforeEach, describe, expect, it } from 'vitest';

import { createSupabaseMock } from '../../testing/supabase-mock.ts';
import { exchangeCodeUseCase } from './exchange-code.use-case.ts';

let supabase: ReturnType<typeof createSupabaseMock>;

beforeEach(() => {
  supabase = createSupabaseMock();
});

describe('exchangeCodeUseCase', () => {
  it('обменивает код на сессию и возвращает true', async () => {
    await expect(exchangeCodeUseCase(supabase.client, 'code-1')).resolves.toBe(true);
    expect(supabase.auth.exchangeCodeForSession).toHaveBeenCalledWith('code-1');
  });

  it('возвращает false, если обмен не удался', async () => {
    supabase.auth.exchangeCodeForSession.mockResolvedValue({
      data: { user: null, session: null },
      error: new AuthApiError('Invalid flow state', 400, 'flow_state_not_found'),
    });

    await expect(exchangeCodeUseCase(supabase.client, 'code-1')).resolves.toBe(false);
  });
});
