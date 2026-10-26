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

export const changePasswordBodySchema = z.strictObject({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(PASSWORD_MIN_LENGTH).max(PASSWORD_MAX_LENGTH),
});

export const changeEmailBodySchema = z.strictObject({
  newEmail: z.email(),
  currentPassword: z.string().min(1),
});

export const authCallbackQuerySchema = z.object({
  code: z.string().min(1),
});

export const emailCallbackQuerySchema = z.object({
  code: z.string().min(1).optional(),
  message: z.string().min(1).optional(),
});

export type Credentials = z.infer<typeof signInBodySchema>;

export type PasswordChange = z.infer<typeof changePasswordBodySchema>;

export type EmailChange = z.infer<typeof changeEmailBodySchema>;

export type EmailCallbackQuery = z.infer<typeof emailCallbackQuerySchema>;
