import { formatBirthDay } from '@/entities/profile';
import { cn } from '@/shared/lib';
import { ArrowIcon, BurgerIcon } from '@/shared/ui/icon';

const promoClassName = 'flex items-center gap-x-3 rounded-2xl bg-stone-100 p-3 sm:p-4';

interface BirthdayPromoProps {
  birthDate: string | null;
  onAddBirthDate: () => void;
}

export const BirthdayPromo = ({ birthDate, onAddBirthDate }: BirthdayPromoProps) => {
  const content = (
    <>
      <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-white">
        <BurgerIcon className="size-8" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-y-0.5">
        <span className="font-bold">Бургер в подарок на день рождения</span>
        <span className="text-sm text-stone-500">
          {birthDate
            ? `Пришлём промокод ${formatBirthDay(birthDate)}. Он действует неделю`
            : 'Укажите дату рождения — пришлём промокод'}
        </span>
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
        'group w-full cursor-pointer text-left focus-ring transition-colors duration-150 hover:bg-stone-200/70',
      )}
    >
      {content}
      <ArrowIcon className="size-3.5 shrink-0 rotate-180 text-stone-400 transition-colors duration-150 group-hover:text-stone-900" />
    </button>
  );
};
