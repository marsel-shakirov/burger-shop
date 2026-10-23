import { useId } from 'react';

import { formatBonusCount, useBonus } from '@/entities/bonus';
import { DotLeaderRow } from '@/shared/ui/dot-leader-row';
import { Skeleton } from '@/shared/ui/skeleton';

import { BONUS_HISTORY_LIMIT } from '../config/profile.constants';

const getStatusText = ({ isPending, isError }: ReturnType<typeof useBonus>) => {
  if (isPending) return 'Загружаем…';
  if (isError) return 'Не удалось загрузить';

  return 'Пока нет начислений';
};

export const BonusCard = () => {
  const bonusResult = useBonus();
  const { bonus, isPending } = bonusResult;
  const titleId = useId();
  const transactions = bonus?.transactions.slice(0, BONUS_HISTORY_LIMIT) ?? [];

  return (
    <section aria-labelledby={titleId} className="flex flex-col gap-y-3">
      <h2 id={titleId} className="font-bold">
        Бонусы
      </h2>

      {transactions.length > 0 ? (
        <ul role="list" className="flex flex-col gap-y-2.5 text-sm">
          {transactions.map((transaction) => (
            <li key={transaction.id}>
              <DotLeaderRow
                label={<span className="min-w-0 truncate">{transaction.title}</span>}
                value={
                  <span className="shrink-0 font-bold tabular-nums">+{transaction.amount}</span>
                }
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-stone-500">{getStatusText(bonusResult)}</p>
      )}

      {(bonus || isPending) && (
        <div className="flex items-baseline justify-between gap-x-4 border-t border-dashed border-stone-300 pt-3">
          <span className="font-bold">Баланс</span>
          {bonus ? (
            <data
              value={bonus.balance}
              className="font-display text-2xl font-extrabold text-ketchup tabular-nums"
            >
              <span aria-hidden="true">{bonus.balance}</span>
              <span className="sr-only">{formatBonusCount(bonus.balance)}</span>
            </data>
          ) : (
            <div className="flex h-8 items-center">
              <Skeleton className="h-5 w-12" />
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-stone-500">1 бонус = 1 ₽</p>
    </section>
  );
};
