import type { NextFunction, Request, Response } from 'express';

import { env } from '../config/env.ts';
import { Forbidden } from '../errors/forbidden.error.ts';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

const allowedOrigins = new Set([env.CLIENT_ORIGIN, ...env.ALLOWED_ORIGINS]);

export function verifyOrigin(req: Request, _res: Response, next: NextFunction) {
  if (!SAFE_METHODS.has(req.method) && !allowedOrigins.has(req.headers.origin ?? '')) {
    throw new Forbidden();
  }

  next();
}
