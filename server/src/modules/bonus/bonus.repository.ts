import { pool } from '../../db.ts';
import { SIGN_UP_GRANT } from './bonus.constants.ts';
import type { BonusTransactionRow } from './bonus.types.ts';

export async function insertSignUpBonus(userId: string) {
  await pool.query(
    `INSERT INTO bonus_transactions (user_id, promo_id, amount)
     SELECT users.id, promos.id, promos.bonus_amount
       FROM promos
       JOIN auth.users AS users ON users.id = $1
      WHERE promos.grant_on = $2
        AND users.created_at >= promos.starts_at
        AND (promos.ends_at IS NULL OR users.created_at < promos.ends_at)
     ON CONFLICT (user_id, promo_id) DO NOTHING`,
    [userId, SIGN_UP_GRANT],
  );
}

export async function findBonusTransactions(userId: string) {
  const result = await pool.query<BonusTransactionRow>(
    `SELECT bonus_transactions.id, bonus_transactions.amount, promos.title, bonus_transactions.created_at
       FROM bonus_transactions
       JOIN promos ON promos.id = bonus_transactions.promo_id
      WHERE bonus_transactions.user_id = $1
      ORDER BY bonus_transactions.created_at DESC, bonus_transactions.id DESC`,
    [userId],
  );
  return result.rows;
}
