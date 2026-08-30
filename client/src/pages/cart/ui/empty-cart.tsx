import { Link } from 'react-router';

import { routes } from '@/shared/routes';
import { ArrowIcon, EmptyCartIcon } from '@/shared/ui/icon';

export const EmptyCart = () => {
  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-y-14">
      <h1 className="text-2xl font-bold sm:text-3xl">Корзина пуста</h1>
      <EmptyCartIcon className="size-34 text-orange-400" />
      <Link
        to={routes.home}
        className="flex cursor-pointer items-center justify-center gap-x-2 rounded-4xl border border-gray-300 p-3 text-gray-300"
        type="button"
      >
        <ArrowIcon className="size-3" />
        <span className="text-sm">Вернуться за покупками</span>
      </Link>
    </section>
  );
};
