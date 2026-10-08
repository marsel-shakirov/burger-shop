import { z } from 'zod';

import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from './auth.constants.ts';

export const signInBodySchema = z.strictObject({
  email: z.email(),
  password: z.string().min(1),
});

export const signUpBodySchema = z.strictObject({
  email: z.email(),
  password: z.string().min(PASSWORD_MIN_LENGTH).max(PASSWORD_MAX_LENGTH),
});

export const authCallbackQuerySchema = z.object({
  code: z.string().min(1),
});

export type Credentials = z.infer<typeof signInBodySchema>;
