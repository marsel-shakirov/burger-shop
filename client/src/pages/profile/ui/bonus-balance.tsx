import { formatBonusUnit } from '@/entities/bonus';
import { Skeleton } from '@/shared/ui/skeleton';

interface BonusBalanceProps {
  balance?: number;
}

export const BonusBalance = ({ balance }: BonusBalanceProps) => {
  return (
    <div className="min-w-0 text-right">
      {balance === undefined ? (
        <div className="flex flex-col items-end gap-1">
          <Skeleton className="h-7 w-14" />
          <Skeleton className="h-3 w-10" />
        </div>
      ) : (
        <data value={balance} className="block">
          <span className="block font-display text-2xl leading-none font-extrabold wrap-anywhere tabular-nums sm:text-[1.75rem]">
            {balance}
          </span>{' '}
          <span className="text-xs font-bold">{formatBonusUnit(balance)}</span>
        </data>
      )}
    </div>
  );
};
