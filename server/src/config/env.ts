import { z } from 'zod';

const originSchema = z.url({ protocol: /^https?$/ }).transform((value) => new URL(value).origin);

const envSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ }),
  SUPABASE_URL: z.url({ protocol: /^https?$/ }).transform((value) => value.replace(/\/+$/, '')),
  SUPABASE_SECRET_KEY: z.string().min(1),
  CLIENT_ORIGIN: originSchema,
  ALLOWED_ORIGINS: z
    .string()
    .default('')
    .transform((value) =>
      value
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean),
    )
    .pipe(z.array(originSchema)),
  COOKIE_SECURE: z.stringbool().default(true),
  TRUST_PROXY: z
    .string()
    .optional()
    .transform((value) => (value && /^\d+$/.test(value) ? Number(value) : value)),
});

export type Env = z.infer<typeof envSchema>;

export function parseEnv(source: Record<string, string | undefined>): Env {
  const defined = Object.fromEntries(Object.entries(source).filter(([, value]) => value !== ''));
  const result = envSchema.safeParse(defined);

  if (!result.success) {
    throw new Error(`Invalid environment variables:\n${z.prettifyError(result.error)}`);
  }

  return result.data;
}

export const env = parseEnv(process.env);
