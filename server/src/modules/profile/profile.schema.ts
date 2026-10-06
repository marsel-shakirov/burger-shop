import { z } from 'zod';

const optionalText = z
  .string()
  .trim()
  .transform((value) => value || null);

export const updateProfileBodySchema = z.strictObject({
  name: optionalText.pipe(z.string().max(50).nullable()),
  phone: optionalText
    .transform((value) => value?.replace(/[\s()-]/g, '') ?? null)
    .pipe(
      z
        .string()
        .regex(/^\+?\d{10,15}$/)
        .nullable(),
    ),
});
