import type { BonusTransaction, BonusTransactionRow } from './bonus.types.ts';

export interface BonusResponse {
  balance: number;
  transactions: BonusTransaction[];
}

export function toBonusResponse(rows: BonusTransactionRow[]): BonusResponse {
  return {
    balance: rows.reduce((sum, row) => sum + row.amount, 0),
    transactions: rows.map((row) => ({
      id: row.id,
      amount: row.amount,
      title: row.title,
      createdAt: row.created_at.toISOString(),
    })),
  };
}
