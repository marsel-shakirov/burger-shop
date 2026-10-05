import type { NextFunction, Request, Response } from 'express';
import { createRemoteJWKSet, errors, jwtVerify } from 'jose';

import { Unauthorized } from '../errors/unauthorized.error.ts';

const issuer = `${process.env.SUPABASE_URL}/auth/v1`;
const jwks = createRemoteJWKSet(new URL(`${issuer}/.well-known/jwks.json`));

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    throw new Unauthorized();
  }

  try {
    const { payload } = await jwtVerify(header.slice('Bearer '.length), jwks, {
      issuer,
      audience: 'authenticated',
      algorithms: ['ES256'],
    });

    if (!payload.sub) {
      throw new Unauthorized();
    }

    req.userId = payload.sub;
  } catch (error) {
    if (error instanceof errors.JWKSTimeout) {
      throw error;
    }

    throw new Unauthorized();
  }

  next();
}

export function getUserId(req: Request): string {
  if (!req.userId) {
    throw new Unauthorized();
  }

  return req.userId;
}
