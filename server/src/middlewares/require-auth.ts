import { isAuthRetryableFetchError } from '@supabase/supabase-js';
import type { NextFunction, Request, Response } from 'express';

import { Unauthorized } from '../errors/unauthorized.error.ts';
import { createSupabase } from '../supabase.ts';
import type {} from '../types/express.d.ts';

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  res.set('Cache-Control', 'no-store');

  const { data, error } = await createSupabase(req, res).auth.getClaims();

  if (isAuthRetryableFetchError(error)) {
    throw error;
  }

  if (!data) {
    throw new Unauthorized();
  }

  req.userId = data.claims.sub;

  next();
}

export function getUserId(req: Request): string {
  if (!req.userId) {
    throw new Unauthorized();
  }

  return req.userId;
}
