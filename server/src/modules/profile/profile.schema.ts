import { z } from 'zod';

import {
  GENDERS,
  MAX_UTC_OFFSET_MS,
  MIN_BIRTH_DATE,
  NAME_MAX_LENGTH,
} from './profile.constants.ts';

const optionalText = z
  .string()
  .trim()
  .transform((value) => value || null);

const latestToday = () => new Date(Date.now() + MAX_UTC_OFFSET_MS).toISOString().slice(0, 10);

export const updateProfileBodySchema = z
  .strictObject({
    name: optionalText.pipe(z.string().max(NAME_MAX_LENGTH).nullable()).optional(),
    phone: optionalText
      .transform((value) => value?.replace(/[\s()-]/g, '') ?? null)
      .pipe(
        z
          .string()
          .regex(/^\+?\d{10,15}$/)
          .nullable(),
      )
      .optional(),
    birthDate: z.iso
      .date()
      .refine((value) => value >= MIN_BIRTH_DATE && value <= latestToday())
      .nullish(),
    gender: z.enum(GENDERS).nullish(),
  })
  .refine((input) => Object.keys(input).length > 0);
