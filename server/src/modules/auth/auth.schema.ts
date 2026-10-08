import { z } from 'zod';

export const credentialsBodySchema = z.strictObject({
  email: z.email(),
  password: z.string().min(1),
});

export const authCallbackQuerySchema = z.object({
  code: z.string().min(1),
});

export type Credentials = z.infer<typeof credentialsBodySchema>;
