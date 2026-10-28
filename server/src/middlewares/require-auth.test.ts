import { AuthApiError, AuthRetryableFetchError } from '@supabase/supabase-js';
import type { NextFunction, Request, Response } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Unauthorized } from '../errors/unauthorized.error.ts';
import { createSupabase } from '../supabase.ts';
import { claimsResult, createSupabaseMock, noClaimsResult } from '../testing/supabase-mock.ts';
import { requireAuth } from './require-auth.ts';

vi.mock('../supabase.ts', () => ({ createSupabase: vi.fn() }));

let supabase: ReturnType<typeof createSupabaseMock>;
let req: Request;
let res: Response;
let next: NextFunction;

beforeEach(() => {
  supabase = createSupabaseMock();
  vi.mocked(createSupabase).mockReturnValue(supabase.client);
  req = { headers: {} } as Request;
  res = { set: vi.fn() } as unknown as Response;
  next = vi.fn();
});

describe('requireAuth', () => {
  it('кладёт id пользователя в запрос и передаёт управление дальше', async () => {
    supabase.auth.getClaims.mockResolvedValue(claimsResult({ sub: 'user-1' }));

    await requireAuth(req, res, next);

    expect(createSupabase).toHaveBeenCalledWith(req, res);
    expect(req.userId).toBe('user-1');
    expect(next).toHaveBeenCalledOnce();
  });

  it('запрещает кешировать ответ', async () => {
    supabase.auth.getClaims.mockResolvedValue(claimsResult({ sub: 'user-1' }));

    await requireAuth(req, res, next);

    expect(res.set).toHaveBeenCalledWith('Cache-Control', 'no-store');
  });

  it('запрещает кешировать ответ и без сессии', async () => {
    supabase.auth.getClaims.mockResolvedValue(noClaimsResult());

    await requireAuth(req, res, next).catch(() => {});

    expect(res.set).toHaveBeenCalledWith('Cache-Control', 'no-store');
  });

  it.each([
    ['сессии нет', noClaimsResult()],
    ['токен невалиден', { data: null, error: new AuthApiError('Invalid JWT', 401, 'bad_jwt') }],
  ])('бросает Unauthorized, если %s', async (_case, result) => {
    supabase.auth.getClaims.mockResolvedValue(result);

    await expect(requireAuth(req, res, next)).rejects.toBeInstanceOf(Unauthorized);
    expect(req.userId).toBeUndefined();
    expect(next).not.toHaveBeenCalled();
  });

  it('пробрасывает сетевую ошибку Supabase, а не отвечает 401', async () => {
    const fetchError = new AuthRetryableFetchError('fetch failed', 0);
    supabase.auth.getClaims.mockResolvedValue({ data: null, error: fetchError });

    await expect(requireAuth(req, res, next)).rejects.toBe(fetchError);
    expect(next).not.toHaveBeenCalled();
  });
});
