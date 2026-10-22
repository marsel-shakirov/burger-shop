export interface BonusTransaction {
  id: string;
  amount: number;
  title: string;
  createdAt: string;
}

export interface Bonus {
  balance: number;
  transactions: BonusTransaction[];
}
