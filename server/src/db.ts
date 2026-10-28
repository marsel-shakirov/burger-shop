import { readFileSync } from 'node:fs';

import { Pool, types } from 'pg';

import { env } from './config/env.ts';

types.setTypeParser(types.builtins.DATE, (value) => value);

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: {
    ca: readFileSync(new URL('../certs/supabase-ca.crt', import.meta.url), 'utf8'),
    rejectUnauthorized: true,
  },
});
