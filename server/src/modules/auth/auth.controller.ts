import type { Request, Response } from 'express';

import { BadRequest } from '../../errors/bad-request.error.ts';
import { WeakPassword } from '../../errors/weak-password.error.ts';
import { createSupabase } from '../../supabase.ts';
import { authCallbackQuerySchema, signInBodySchema, signUpBodySchema } from './auth.schema.ts';
import { exchangeCodeUseCase } from './exchange-code.use-case.ts';
import { getSessionUseCase } from './get-session.use-case.ts';
import { signInUseCase } from './sign-in.use-case.ts';
import { signOutUseCase } from './sign-out.use-case.ts';
import { signUpUseCase } from './sign-up.use-case.ts';

export async function signUp(req: Request, res: Response) {
  const result = signUpBodySchema.safeParse(req.body);

  if (!result.success) {
    const isPasswordIssue = result.error.issues.some((issue) => issue.path[0] === 'password');
    throw isPasswordIssue ? new WeakPassword(['length']) : new BadRequest();
  }

  const user = await signUpUseCase(createSupabase(req, res), result.data);

  res.status(201).json({ user });
}

export async function signIn(req: Request, res: Response) {
  console.log('ip-check', {
    ip: req.ip,
    xff: req.headers['x-forwarded-for'],
    realIp: req.headers['x-real-ip'],
    vercelXff: req.headers['x-vercel-forwarded-for'],
  });

  const result = signInBodySchema.safeParse(req.body);

  if (!result.success) {
    throw new BadRequest();
  }

  const user = await signInUseCase(createSupabase(req, res), result.data);

  res.json({ user });
}

export async function signOut(req: Request, res: Response) {
  await signOutUseCase(createSupabase(req, res));

  res.status(204).end();
}

export async function getSession(req: Request, res: Response) {
  res.set('Cache-Control', 'no-store');

  const user = await getSessionUseCase(createSupabase(req, res));

  res.json({ user });
}

export async function authCallback(req: Request, res: Response) {
  const result = authCallbackQuerySchema.safeParse(req.query);

  if (!result.success) {
    return res.redirect('/login?error=confirm_failed');
  }

  const isSignedIn = await exchangeCodeUseCase(createSupabase(req, res), result.data.code);

  res.redirect(isSignedIn ? '/profile' : '/login?email_confirmed=1');
}
