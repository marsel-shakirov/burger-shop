import { Link } from 'react-router';

import { routes } from '@/shared/routes';
import { ArrowIcon, CartIcon, EmptyCartIcon } from '@/shared/ui/icon';

export const EmptyCart = () => {
  return (
    <section className="flex flex-1 flex-col gap-y-14 px-56">
      <header className="flex items-center gap-x-4 pt-23.5">
        <CartIcon className="h-7.25 w-7.25 text-gray-500" />
        <h1 className="text-[32px] font-bold">Корзина пуста</h1>
      </header>
      <EmptyCartIcon className="h-48 w-48 self-center text-orange-400" />
      <div className="flex items-center gap-x-6">
        <Link
          to={routes.home}
          className="flex cursor-pointer items-center justify-center gap-x-3 rounded-4xl border border-gray-300 px-6 py-3.5 text-gray-300"
          type="button"
        >
          <ArrowIcon className="h-3 w-3" />
          <span>Вернуться назад</span>
        </Link>
        <span className="text-[24px] font-bold text-gray-600">Добавьте товары из нашего меню</span>
      </div>
    </section>
  );
};
