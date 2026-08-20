import { Link } from 'react-router';

import { selectTotalPrice, selectTotalQuantity, useCartStore } from '@/entities/cart';
import { routes } from '@/shared/routes';
import { Container } from '@/shared/ui/container';
import { ArrowIcon, CartIcon, DeleteIcon } from '@/shared/ui/icon';
import { CartList } from '@/widgets/cart-list';

export const CartPage = () => {
  const totalPrice = useCartStore(selectTotalPrice);
  const totalQuantity = useCartStore(selectTotalQuantity);
  const clearCart = useCartStore((state) => state.clearCart);

  return (
    <main className="flex flex-1">
      <Container className="flex flex-1 flex-col">
        <section className="flex flex-1 flex-col gap-y-9 px-56">
          <header className="flex items-center gap-x-4 pt-23.5">
            <CartIcon className="h-7.25 w-7.25 text-gray-500" />
            <h1 className="text-[32px] leading-tight font-bold">Товары в корзине</h1>

            <button
              onClick={clearCart}
              className="ml-auto flex cursor-pointer items-center gap-x-1.75 text-gray-400"
              type="button"
            >
              <DeleteIcon className="h-6 w-6" />
              <span className="leading-tight">Очистить корзину</span>
            </button>
          </header>

          <CartList />

          <footer className="flex flex-col gap-y-10 pb-11">
            <div className="flex items-center justify-between text-xl">
              <div>
                <span>Всего бургеров:</span>&nbsp;
                <span className="font-bold">{totalQuantity}&nbsp;шт</span>
              </div>
              <div>
                <span>Сумма заказа:</span>&nbsp;
                <span className="font-bold text-orange-500">{totalPrice}&nbsp;₽</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Link
                to={routes.home}
                className="flex cursor-pointer items-center justify-center gap-x-3 rounded-4xl border border-gray-300 px-6 py-3.5 text-gray-300"
                type="button"
              >
                <ArrowIcon className="h-3 w-3" />
                <span>Вернуться назад</span>
              </Link>
              <button
                className="cursor-pointer rounded-4xl bg-orange-500 px-6 py-3.5 font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
                type="button"
              >
                Оплатить сейчас
              </button>
            </div>
          </footer>
        </section>
      </Container>
    </main>
  );
};
