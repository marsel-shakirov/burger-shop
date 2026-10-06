import { DatabaseError } from 'pg';

import { pool } from '../../db.ts';
import type { ProfileInput, ProfileRow } from './profile.types.ts';

export async function findProfile(userId: string) {
  const result = await pool.query<ProfileRow>(
    'SELECT id, name, phone FROM profiles WHERE id = $1',
    [userId],
  );
  return result.rows[0];
}

export async function upsertProfile(userId: string, { name, phone }: ProfileInput) {
  try {
    const result = await pool.query<ProfileRow>(
      `INSERT INTO profiles (id, name, phone)
  VALUES ($1, $2, $3)
       ON CONFLICT (id) DO UPDATE SET name =
  EXCLUDED.name, phone = EXCLUDED.phone
       RETURNING id, name, phone`,
      [userId, name, phone],
    );
    return result.rows[0];
  } catch (error) {
    if (error instanceof DatabaseError && error.code === '23503') return undefined;
    throw error;
  }
}
