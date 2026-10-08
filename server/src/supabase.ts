import { createServerClient, parseCookieHeader, serializeCookieHeader } from '@supabase/ssr';
import type { Request, Response } from 'express';

const { SUPABASE_URL, SUPABASE_SECRET_KEY } = process.env;

if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
  throw new Error('SUPABASE_URL and SUPABASE_SECRET_KEY must be set');
}

export const createSupabase = (req: Request, res: Response) =>
  createServerClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
    global: {
      headers: req.ip ? { 'sb-forwarded-for': req.ip } : {},
    },
    cookieOptions: {
      httpOnly: true,
      secure: true,
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
