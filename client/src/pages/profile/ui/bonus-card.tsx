import { useId } from 'react';

import { useBonus } from '@/entities/bonus';

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
