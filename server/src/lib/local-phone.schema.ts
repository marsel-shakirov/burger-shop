import { z } from 'zod';

export const localPhoneSchema = z
  .string()
  .transform((value) => {
    const phone = value.replace(/[\s()-]/g, '');

    if (/^[78]\d{10}$/.test(phone)) return `+7${phone.slice(1)}`;
    if (/^\d{10}$/.test(phone)) return `+7${phone}`;

    return phone;
  })
  .pipe(z.string().regex(/^\+7\d{10}$/));
