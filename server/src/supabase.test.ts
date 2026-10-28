import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import type { Request, Response } from 'express';
import { describe, expect, it, vi } from 'vitest';

import { env } from './config/env.ts';
import { createStatelessSupabase, createSupabase } from './supabase.ts';

vi.mock('@supabase/ssr', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@supabase/ssr')>()),
  createServerClient: vi.fn(),
}));

vi.mock('@supabase/supabase-js', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@supabase/supabase-js')>()),
  createClient: vi.fn(),
}));

interface CookieMethods {
  getAll: () => { name: string; value: string }[];
  setAll: (
    cookies: { name: string; value: string; options: object }[],
    headers: Record<string, string>,
  ) => void;
}

const SUPABASE_URL = 'http://supabase.test';
const SUPABASE_SECRET_KEY = 'test-secret-key';

const createRequest = (overrides: Partial<Request> = {}) =>
  ({ ip: '203.0.113.5', headers: {}, ...overrides }) as Request;

const createResponse = () => ({ append: vi.fn(), set: vi.fn() }) as unknown as Response;

function getServerClientOptions() {
  const [url, key, options] = vi.mocked(createServerClient).mock.calls[0];
  return { url, key, options, cookies: options.cookies as CookieMethods };
}

describe('createSupabase', () => {
  it('создаёт серверный клиент по URL и секретному ключу', () => {
    createSupabase(createRequest(), createResponse());

    const { url, key } = getServerClientOptions();

    expect(url).toBe(SUPABASE_URL);
    expect(key).toBe(SUPABASE_SECRET_KEY);
  });

  it('передаёт IP клиента в заголовке sb-forwarded-for', () => {
    createSupabase(createRequest(), createResponse());

    expect(getServerClientOptions().options.global).toEqual({
      headers: { 'sb-forwarded-for': '203.0.113.5' },
    });
  });

  it('не добавляет sb-forwarded-for, если IP неизвестен', () => {
    createSupabase(createRequest({ ip: undefined }), createResponse());

    expect(getServerClientOptions().options.global).toEqual({ headers: {} });
  });

  it('ставит httpOnly-cookie на /api с secure из конфигурации', () => {
    createSupabase(createRequest(), createResponse());

    expect(getServerClientOptions().options.cookieOptions).toEqual({
      httpOnly: true,
      secure: env.COOKIE_SECURE,
      sameSite: 'lax',
      path: '/api',
    });
  });

  it('читает cookie из заголовка запроса', () => {
    createSupabase(createRequest({ headers: { cookie: 'sb-a=1; sb-b=2' } }), createResponse());

    expect(getServerClientOptions().cookies.getAll()).toEqual([
      { name: 'sb-a', value: '1' },
      { name: 'sb-b', value: '2' },
    ]);
  });

  it('возвращает пустой список cookie без заголовка Cookie', () => {
    createSupabase(createRequest(), createResponse());

    expect(getServerClientOptions().cookies.getAll()).toEqual([]);
  });

  it('добавляет каждую cookie отдельным Set-Cookie и выставляет заголовки', () => {
    const res = createResponse();
    createSupabase(createRequest(), res);

    getServerClientOptions().cookies.setAll(
      [
        { name: 'sb-a', value: '1', options: { path: '/api', httpOnly: true } },
        { name: 'sb-b', value: '', options: { path: '/api', maxAge: 0 } },
      ],
      { 'Cache-Control': 'private, no-cache, no-store' },
    );

    expect(res.append).toHaveBeenNthCalledWith(1, 'Set-Cookie', 'sb-a=1; Path=/api; HttpOnly');
    expect(res.append).toHaveBeenNthCalledWith(2, 'Set-Cookie', 'sb-b=; Max-Age=0; Path=/api');
    expect(res.set).toHaveBeenCalledWith({ 'Cache-Control': 'private, no-cache, no-store' });
  });
});

describe('createStatelessSupabase', () => {
  it('создаёт клиент без хранения и обновления сессии', () => {
    createStatelessSupabase(createRequest());

    expect(createClient).toHaveBeenCalledWith(SUPABASE_URL, SUPABASE_SECRET_KEY, {
      global: { headers: { 'sb-forwarded-for': '203.0.113.5' } },
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
  });
});
