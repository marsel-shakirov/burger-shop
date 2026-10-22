import type { Request } from 'express';

import { Unauthorized } from '../errors/unauthorized.error.ts';
import type {} from '../types/express.d.ts';

export function getUserId(req: Request): string {
  if (!req.userId) {
    throw new Unauthorized();
  }

  return req.userId;
}
