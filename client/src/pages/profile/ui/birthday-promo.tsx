import { formatBirthDay } from '@/entities/profile';
import { cn } from '@/shared/lib';
import { ArrowIcon, BurgerIcon } from '@/shared/ui/icon';

const promoClassName =
  'flex items-center gap-3.5 rounded-2xl border border-lime-900/10 bg-pickle p-3.5 md:px-4';

interface BirthdayPromoProps {
  birthDate: string | null;
  onAddBirthDate: () => void;
}

export const BirthdayPromo = ({ birthDate, onAddBirthDate }: BirthdayPromoProps) => {
  const content = (
    <>
      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-paper">
        <BurgerIcon className="size-7.5" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-y-0.5">
        <span className="font-extrabold">Бургер в подарок</span>
        <span className="text-sm leading-snug text-stone-700">
          {birthDate
            ? `Пришлём промокод ${formatBirthDay(birthDate)}. Он действует неделю.`
            : 'Промокод придёт в день рождения.'}
        </span>
        {!birthDate && (
          <span className="mt-1 text-sm font-bold underline underline-offset-4">
            Указать дату рождения
          </span>
        )}
      </span>
    </>
  );

  if (birthDate) {
    return <div className={promoClassName}>{content}</div>;
  }

  return (
    <button
      type="button"
      onClick={onAddBirthDate}
      className={cn(
        promoClassName,
        'w-full cursor-pointer text-left focus-ring transition-colors duration-150 hover:bg-lime-200',
      )}
    >
      {content}
      <ArrowIcon className="size-3 shrink-0 rotate-180 text-stone-700" />
    </button>
  );
};
