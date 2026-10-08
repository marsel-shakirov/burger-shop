import type { NextFunction, Request, Response } from 'express';

import { Forbidden } from '../errors/forbidden.error.ts';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

export function verifyOrigin(req: Request, _res: Response, next: NextFunction) {
  if (!SAFE_METHODS.has(req.method) && req.headers.origin !== process.env.CLIENT_ORIGIN) {
    throw new Forbidden();
  }

  next();
}
