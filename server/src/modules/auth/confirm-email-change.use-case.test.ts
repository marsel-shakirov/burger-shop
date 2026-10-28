import { AuthApiError } from '@supabase/supabase-js';
import { beforeEach, describe, expect, it } from 'vitest';

import { createSupabaseMock } from '../../testing/supabase-mock.ts';
import { confirmEmailChangeUseCase } from './confirm-email-change.use-case.ts';

let supabase: ReturnType<typeof createSupabaseMock>;

beforeEach(() => {
  supabase = createSupabaseMock();
});

describe('confirmEmailChangeUseCase', () => {
  it('возвращает changed, если код обменялся на сессию', async () => {
    await expect(confirmEmailChangeUseCase(supabase.client, { code: 'code-1' })).resolves.toBe(
      'changed',
    );
    expect(supabase.auth.exchangeCodeForSession).toHaveBeenCalledWith('code-1');
  });

  it('возвращает failed, если код не обменялся', async () => {
    supabase.auth.exchangeCodeForSession.mockResolvedValue({
      data: { user: null, session: null },
      error: new AuthApiError('Invalid flow state', 400, 'flow_state_not_found'),
    });

    await expect(confirmEmailChangeUseCase(supabase.client, { code: 'code-1' })).resolves.toBe(
      'failed',
    );
  });

  it('предпочитает code, если пришли и code, и message', async () => {
    await expect(
      confirmEmailChangeUseCase(supabase.client, {
        code: 'code-1',
        message: 'Confirmation link accepted',
      }),
    ).resolves.toBe('changed');
  });

  it('возвращает confirm_other, если пришло только сообщение о первом подтверждении', async () => {
    await expect(
      confirmEmailChangeUseCase(supabase.client, { message: 'Confirmation link accepted' }),
    ).resolves.toBe('confirm_other');
    expect(supabase.auth.exchangeCodeForSession).not.toHaveBeenCalled();
  });

  it('возвращает failed без code и message', async () => {
    await expect(confirmEmailChangeUseCase(supabase.client, {})).resolves.toBe('failed');
    expect(supabase.auth.exchangeCodeForSession).not.toHaveBeenCalled();
  });
});
