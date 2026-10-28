import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createSupabase } from '../../supabase.ts';
import { api } from '../../testing/http.ts';
import { claimsResult, createSupabaseMock } from '../../testing/supabase-mock.ts';
import { getBonusUseCase } from './get-bonus.use-case.ts';

vi.mock('../../supabase.ts', () => ({ createSupabase: vi.fn(), createStatelessSupabase: vi.fn() }));

vi.mock('./get-bonus.use-case.ts', () => ({ getBonusUseCase: vi.fn() }));

beforeEach(() => {
  const supabase = createSupabaseMock();
  supabase.auth.getClaims.mockResolvedValue(claimsResult({ sub: 'user-1' }));
  vi.mocked(createSupabase).mockReturnValue(supabase.client);
});

describe('GET /api/bonus', () => {
  it('отдаёт бонусы пользователя', async () => {
    const bonus = { balance: 500, transactions: [] };
    vi.mocked(getBonusUseCase).mockResolvedValue(bonus);

    const response = await api().get('/api/bonus');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(bonus);
    expect(getBonusUseCase).toHaveBeenCalledWith('user-1');
  });
});
