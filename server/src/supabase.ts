import { createServerClient, parseCookieHeader, serializeCookieHeader } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import type { Request, Response } from 'express';

import { env } from './config/env.ts';

const { SUPABASE_URL, SUPABASE_SECRET_KEY } = env;

const getForwardedHeaders = (req: Request): Record<string, string> =>
  req.ip ? { 'sb-forwarded-for': req.ip } : {};

export const createSupabase = (req: Request, res: Response) =>
  createServerClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
    global: {
      headers: getForwardedHeaders(req),
    },
    cookieOptions: {
      httpOnly: true,
      secure: env.COOKIE_SECURE,
      sameSite: 'lax',
      path: '/api',
    },
    cookies: {
      getAll() {
        return parseCookieHeader(req.headers.cookie ?? '');
      },
      setAll(cookiesToSet, headers) {
        for (const { name, value, options } of cookiesToSet) {
          res.append('Set-Cookie', serializeCookieHeader(name, value, options));
        }

        res.set(headers);
      },
    },
  });

export type Supabase = ReturnType<typeof createSupabase>;

export const createStatelessSupabase = (req: Request) =>
  createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
    global: {
      headers: getForwardedHeaders(req),
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

export type StatelessSupabase = ReturnType<typeof createStatelessSupabase>;
