import { BurgerIcon } from '@/shared/ui/icon';

export const BirthdayPromo = () => {
  return (
    <div className="flex items-center gap-x-3 rounded-2xl bg-stone-100 p-3 sm:p-4">
      <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-white">
        <BurgerIcon className="size-8" />
      </span>
      <div className="flex min-w-0 flex-col gap-y-0.5">
        <p className="font-bold">Бургер в подарок на день рождения</p>
        <p className="text-sm text-stone-500">
          Пришлём промокод в день рождения. Он действует неделю
        </p>
      </div>
    </div>
  );
};
