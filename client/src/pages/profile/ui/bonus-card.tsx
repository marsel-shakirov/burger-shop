import { useId } from 'react';

import { formatBonusUnit, useBonus } from '@/entities/bonus';
import { Skeleton } from '@/shared/ui/skeleton';

import { BONUS_HISTORY_LIMIT } from '../config/profile.constants';

interface BonusBalanceProps {
  balance?: number;
}

const BonusBalance = ({ balance }: BonusBalanceProps) => {
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

const getStatusText = ({ isPending, isError }: { isPending: boolean; isError: boolean }) => {
  if (isPending) return 'Загружаем…';
  if (isError) return 'Не удалось загрузить';

  return 'Пока нет начислений';
};

export const BonusCard = () => {
  const { bonus, isPending, isError } = useBonus();
  const titleId = useId();
  const transactions = bonus?.transactions.slice(0, BONUS_HISTORY_LIMIT) ?? [];

  return (
    <section
      aria-labelledby={titleId}
      className="rounded-[1.125rem] border border-t-[5px] border-stone-200 border-t-pickle bg-white text-stone-900 md:shadow-[0_18px_30px_-24px_#5b542a70]"
    >
      <div className="flex min-h-19 items-center justify-between gap-3 px-4 py-3.5 md:px-5 md:py-4.5">
        <div className="shrink-0">
          <h2 id={titleId} className="font-display text-sm font-extrabold md:text-base">
            Бонусы
          </h2>
          <p className="mt-1 text-xs text-stone-600">1 бонус = 1 ₽</p>
        </div>
        {(bonus || isPending) && <BonusBalance balance={bonus?.balance} />}
      </div>

      <div className="border-t border-stone-200 px-4 py-3 md:px-5 md:py-4">
        {transactions.length > 0 ? (
          <>
            <h3 className="text-xs font-bold text-stone-600">Последние начисления</h3>
            <ul role="list" className="mt-1.5 divide-y divide-stone-200 text-sm">
              {transactions.map((transaction) => (
                <li
                  key={transaction.id}
                  className="flex items-center justify-between gap-2 py-1.5 md:py-2"
                >
                  <span className="min-w-0 wrap-anywhere">{transaction.title}</span>
                  <span className="shrink-0 rounded-md bg-pickle px-2 py-0.5 font-bold tabular-nums">
                    +{transaction.amount}
                  </span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-sm text-stone-600">{getStatusText({ isPending, isError })}</p>
        )}
      </div>
    </section>
  );
};
