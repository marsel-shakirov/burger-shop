import { Link } from 'react-router';

import bigSpecialPng from '@/shared/assets/img/product/mobile.png';
import { Container } from '@/shared/ui/container';
import {
  ArrowIcon,
  CartIcon,
  DeleteIcon,
  QtyMinusIcon,
  QtyPlusIcon,
  RemoveItemIcon,
} from '@/shared/ui/icon';

export const CartPage = () => {
  return (
    <main className="flex flex-1">
      <Container className="flex flex-1 flex-col">
        <section className="flex flex-1 flex-col gap-y-9 px-56">
          <header className="flex items-center gap-x-4 pt-23.5">
            <CartIcon className="h-7.25 w-7.25 text-gray-500" />
            <h1 className="text-[32px] leading-tight font-bold">Товары в корзине</h1>
            <button
              className="ml-auto flex cursor-pointer items-center gap-x-1.75 text-gray-400"
              type="button"
            >
              <DeleteIcon className="h-6 w-6" />
              <span className="leading-tight">Очистить корзину</span>
            </button>
          </header>

          <ul className="flex flex-1 flex-col gap-y-7">
            <li className="border-t border-[#F4F4F4] pt-7">
              <article className="flex cursor-pointer items-center justify-between">
                <div className="flex items-center gap-x-3">
                  <img src={bigSpecialPng} alt="" width={81} height={81} />
                  <div className="flex w-70 flex-col">
                    <h2 className="line-clamp-2 text-[20px] leading-5 font-bold">
                      Тройной Чизбургер Три Сыра
                    </h2>
                    <p className="truncate text-lg leading-tight text-gray-400">
                      Описание Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae
                      commodi dicta inventore, et beatae veritatis nostrum assumenda perspiciatis
                      natus aperiam quasi adipisci delectus quod, repudiandae pariatur ratione
                      suscipit. Ratione, adipisci.
                    </p>
                  </div>
                </div>

                <div className="inline-flex items-center justify-between gap-x-3">
                  <button
                    className="cursor-pointer"
                    type="button"
                    aria-label="Уменьшить количество"
                  >
                    <QtyMinusIcon className="h-8 w-8 text-orange-500" />
                  </button>
                  <output
                    className="text-center text-[22px] font-bold"
                    aria-label="Количество товара"
                    aria-live="polite"
                  >
                    {3}
                  </output>
                  <button
                    className="cursor-pointer"
                    type="button"
                    aria-label="Увеличить количество"
                  >
                    <QtyPlusIcon className="h-8 w-8 text-orange-500" />
                  </button>
                </div>

                <data className="text-[22px] font-bold" value={770}>
                  770&nbsp;₽
                </data>

                <button
                  className="cursor-pointer"
                  type="button"
                  aria-label="Удалить товар из корзины"
                >
                  <RemoveItemIcon className="h-8 w-8 text-gray-400" />
                </button>
              </article>
            </li>
          </ul>

          <footer className="flex flex-col gap-y-10 pb-11">
            <div className="flex items-center justify-between text-xl">
              <div>
                <span>Всего бургеров:</span>&nbsp;
                <span className="font-bold">3&nbsp;шт</span>
              </div>
              <div>
                <span>Сумма заказа:</span>&nbsp;
                <span className="font-bold text-orange-500">900&nbsp;₽</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Link
                to="/"
                className="flex cursor-pointer items-center justify-center gap-x-3 rounded-4xl border border-gray-300 px-6 py-3.5 text-gray-300"
                type="button"
              >
                <ArrowIcon className="h-3 w-3" />
                <span>Вернуться назад</span>
              </Link>
              <button
                className="cursor-pointer rounded-4xl bg-orange-500 px-6 py-3.5 font-bold text-white"
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
