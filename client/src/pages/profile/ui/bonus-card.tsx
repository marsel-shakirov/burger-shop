import { useId } from 'react';

import { useBonus } from '@/entities/bonus';
import { DotLeaderRow } from '@/shared/ui/dot-leader-row';

import { BONUS_HISTORY_LIMIT } from '../config/profile.constants';
import { BonusBalance } from './bonus-balance';

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
        <p className="text-sm text-stone-500">{getStatusText({ isPending, isError })}</p>
      )}

      {(bonus || isPending) && <BonusBalance balance={bonus?.balance} />}

      <p className="text-xs text-stone-500">1 бонус = 1 ₽</p>
    </section>
  );
};
