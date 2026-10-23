import { formatBonusCount } from '@/entities/bonus';
import { Skeleton } from '@/shared/ui/skeleton';

interface BonusBalanceProps {
  balance?: number;
}

export const BonusBalance = ({ balance }: BonusBalanceProps) => {
  return (
    <div className="flex items-baseline justify-between gap-x-4 border-t border-dashed border-stone-300 pt-3">
      <span className="font-bold">Баланс</span>
      {balance === undefined ? (
        <div className="flex h-8 items-center">
          <Skeleton className="h-5 w-12" />
        </div>
      ) : (
        <data
          value={balance}
          className="font-display text-2xl font-extrabold text-ketchup tabular-nums"
        >
          <span aria-hidden="true">{balance}</span>
          <span className="sr-only">{formatBonusCount(balance)}</span>
        </data>
      )}
    </div>
  );
};
