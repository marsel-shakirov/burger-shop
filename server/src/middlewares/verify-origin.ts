import type { NextFunction, Request, Response } from 'express';

import { Forbidden } from '../errors/forbidden.error.ts';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

const allowedOrigins = new Set(
  [process.env.CLIENT_ORIGIN, ...(process.env.ALLOWED_ORIGINS ?? '').split(',')]
    .map((origin) => origin?.trim())
    .filter(Boolean),
);

export function verifyOrigin(req: Request, _res: Response, next: NextFunction) {
  if (!SAFE_METHODS.has(req.method) && !allowedOrigins.has(req.headers.origin ?? '')) {
    throw new Forbidden();
  }

  next();
}
