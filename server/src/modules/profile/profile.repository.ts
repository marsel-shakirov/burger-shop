import { DatabaseError } from 'pg';

import { pool } from '../../db.ts';
import type { ProfileInput, ProfileRow } from './profile.types.ts';

const PROFILE_COLUMNS = 'id, name, phone, birth_date, gender';

const INPUT_COLUMNS: Record<keyof ProfileInput, string> = {
  name: 'name',
  phone: 'phone',
  birthDate: 'birth_date',
  gender: 'gender',
};

export async function findProfile(userId: string) {
  const result = await pool.query<ProfileRow>(
    `SELECT ${PROFILE_COLUMNS} FROM profiles WHERE id = $1`,
    [userId],
  );
  return result.rows[0];
}

export async function upsertProfile(userId: string, input: ProfileInput) {
  const entries = (Object.keys(INPUT_COLUMNS) as (keyof ProfileInput)[])
    .filter((key) => input[key] !== undefined)
    .map((key) => [INPUT_COLUMNS[key], input[key]] as const);

  const columns = entries.map(([column]) => column);
  const placeholders = entries.map((_, index) => `$${index + 2}`);
  const updates = columns.map((column) => `${column} = EXCLUDED.${column}`);

  try {
    const result = await pool.query<ProfileRow>(
      `INSERT INTO profiles (id, ${columns.join(', ')})
       VALUES ($1, ${placeholders.join(', ')})
       ON CONFLICT (id) DO UPDATE SET ${updates.join(', ')}
       RETURNING ${PROFILE_COLUMNS}`,
      [userId, ...entries.map(([, value]) => value)],
    );
    return result.rows[0];
  } catch (error) {
    if (error instanceof DatabaseError && error.code === '23503') return undefined;
    throw error;
  }
}
