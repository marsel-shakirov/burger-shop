import { readFileSync } from 'node:fs';

import { types } from 'pg';
import { describe, expect, it } from 'vitest';

import { pool } from './db.ts';

describe('db', () => {
  it('отдаёт DATE строкой без перевода в Date и часовой пояс', () => {
    expect(types.getTypeParser(types.builtins.DATE)('1990-05-17')).toBe('1990-05-17');
  });

  it('подключается по DATABASE_URL', () => {
    expect(pool.options.connectionString).toBe('postgres://test:test@127.0.0.1:1/test');
  });

  it('проверяет сертификат сервера по CA Supabase', () => {
    expect(pool.options.ssl).toEqual({
      ca: readFileSync(new URL('../certs/supabase-ca.crt', import.meta.url), 'utf8'),
      rejectUnauthorized: true,
    });
  });
});
