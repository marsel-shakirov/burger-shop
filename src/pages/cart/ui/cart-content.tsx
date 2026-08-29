import { Link } from 'react-router';

import { selectTotalPrice, selectTotalQuantity, useCartStore } from '@/entities/cart';
import { routes } from '@/shared/routes';
import { ArrowIcon, DeleteIcon } from '@/shared/ui/icon';
import { CartList } from '@/widgets/cart-list';

export const CartContent = () => {
  const totalPrice = useCartStore(selectTotalPrice);
  const totalQuantity = useCartStore(selectTotalQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  return (
    <section className="flex flex-1 flex-col gap-y-2 sm:px-[clamp(20px,9vw,60px)]">
      <h1 className="pt-[clamp(12px,4vw,32px)] text-2xl font-bold sm:text-3xl">Товары в корзине</h1>
      {/* <header className="flex justify-end-safe gap-x-2 px-5 pt-4"> */}
      {/* <div className="flex items-center gap-x-1.5">
          <CartIcon className="size-5 text-gray-500 md:size-6" />
          <h2 className="text font-bold md:text-xl">Заказы</h2>
        </div> */}

      <button
        onClick={clearCart}
        className="flex cursor-pointer items-center justify-end-safe gap-x-1 px-5 pt-4 text-gray-400"
        type="button"
      >
        <DeleteIcon className="size-5 md:size-6" />
        <span className="text-sm md:text-lg">Очистить корзину</span>
      </button>
      {/* </header> */}

      <CartList />

      <footer className="flex flex-col gap-y-5 px-3 pb-11">
        <div className="flex flex-col items-end-safe justify-between gap-y-1 text-lg">
          <div>
            <span>Всего бургеров:</span>&nbsp;
            <span className="font-bold">{totalQuantity}&nbsp;шт</span>
          </div>
          <div>
            <span>Сумма заказа:</span>&nbsp;
            <span className="font-bold text-orange-500">{totalPrice}&nbsp;₽</span>
          </div>
        </div>

        <div className="inline-flex items-center justify-between gap-x-3.5">
          <Link
            to={routes.home}
            className="flex cursor-pointer items-center justify-center gap-x-2 rounded-4xl border border-gray-300 p-3 text-gray-300"
            type="button"
          >
            <ArrowIcon className="size-3" />
            <span className="sr-only text-sm min-[425px]:not-sr-only">Вернуться за покупками</span>
          </Link>
          <button
            className="cursor-pointer rounded-4xl bg-orange-500 p-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
            type="button"
          >
            Оплатить сейчас
          </button>
        </div>
      </footer>
    </section>
  );
};
