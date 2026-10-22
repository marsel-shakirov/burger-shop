export interface BonusTransactionRow {
  id: string;
  amount: number;
  title: string;
  created_at: Date;
}

export interface BonusTransaction {
  id: string;
  amount: number;
  title: string;
  createdAt: string;
}
