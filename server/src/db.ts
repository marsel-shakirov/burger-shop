import { readFileSync } from 'node:fs';

import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    ca: readFileSync(new URL('../certs/supabase-ca.crt', import.meta.url), 'utf8'),
    rejectUnauthorized: true,
  },
});
