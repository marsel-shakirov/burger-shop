import { Link } from 'react-router';

import { routes } from '@/shared/config';
import { cn, useLastSearch } from '@/shared/lib';
import { buttonClass } from '@/shared/ui/button';
import { EmptyPlate } from '@/shared/ui/icon';

import { CartHeader } from './cart-header';
import { CartSuggestions } from './cart-suggestions';

export const EmptyCart = () => {
  const homeSearch = useLastSearch(routes.home);

  return (
    <section className="flex flex-1 flex-col gap-y-5 pb-8 sm:gap-y-8 sm:pb-12">
      <CartHeader subtitle="Пока пусто" />

      <div className="flex flex-col items-center rounded-xl bg-white px-5 pt-8 pb-7 text-center shadow-(--shadow-base) sm:pt-12 sm:pb-10">
        <EmptyPlate className="w-44 sm:w-60" />

        <h2 className="mt-6 text-xl font-bold sm:text-2xl">Вы ещё ничего не выбрали</h2>
        <p className="mt-2 max-w-md text-balance text-stone-500">
          Добавьте бургер, напиток или чай из меню, и они появятся здесь
        </p>

        <Link
          to={{ pathname: routes.home, search: homeSearch }}
          className={cn(buttonClass, 'mt-6')}
        >
          Открыть меню
        </Link>
      </div>

      <CartSuggestions />
    </section>
  );
};
