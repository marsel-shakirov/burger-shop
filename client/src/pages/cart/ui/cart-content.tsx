// import { Link } from 'react-router';

// import {
//   selectClearCart,
//   selectTotalPrice,
//   selectTotalQuantity,
//   useCartStore,
// } from '@/entities/cart';
// import { routes } from '@/shared/config';
// import { ArrowIcon, DeleteIcon } from '@/shared/ui/icon';
import { selectClearCart, useCartStore } from '@/entities/cart';
import { DeleteIcon } from '@/shared/ui/icon';
// import { CartList } from './cart-list';

export const CartContent = () => {
  // const totalPrice = useCartStore(selectTotalPrice);
  // const totalQuantity = useCartStore(selectTotalQuantity);
  const clearCart = useCartStore(selectClearCart);

  return (
    <section className="flex flex-1 flex-col gap-y-3">
      <h1 className="pt-4 text-2xl font-bold sm:pt-7 sm:text-4xl">Товары в корзине</h1>

      <div>
        <button
          onClick={clearCart}
          className="ml-auto flex cursor-pointer items-center justify-center gap-x-1 rounded-md text-gray-400 focus-ring opacity-80 hover:opacity-100"
          type="button"
        >
          <DeleteIcon className="size-5 md:size-6" />
          <span className="text-sm md:text-lg">Очистить корзину</span>
        </button>
      </div>

      {/* 

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
          >
            <ArrowIcon className="size-3" />
            <span className="sr-only text-sm min-[425px]:not-sr-only">Вернуться за покупками</span>
          </Link>
          <button
            type="button"
            disabled={true}
            className="cursor-pointer rounded-4xl bg-orange-500 p-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Оплатить сейчас
          </button>
        </div>
      </footer> */}
    </section>
  );
};
