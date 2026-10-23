import { Link } from 'react-router';

import { routes } from '@/shared/config';
import { formatPrice, useLastSearch } from '@/shared/lib';
import { Button } from '@/shared/ui/button';
import { ArrowIcon } from '@/shared/ui/icon';
import { Receipt } from '@/shared/ui/receipt';

import type { CartLine } from '../model/use-cart-lines';

interface CartSummaryProps {
  lines: CartLine[];
  totalPrice: number;
}

export const CartSummary = ({ lines, totalPrice }: CartSummaryProps) => {
  const homeSearch = useLastSearch(routes.home);

  return (
    <aside
      aria-labelledby="cart-summary-title"
      className="flex flex-col gap-y-5 lg:sticky lg:top-6"
    >
      <Receipt.Root>
        <Receipt.Body className="pt-5 pb-7">
          <h2 id="cart-summary-title" className="text-lg font-bold">
            Ваш заказ
          </h2>

          <ul role="list" className="flex flex-col gap-y-2.5 text-sm">
            {lines.map(({ product, entry }) => (
              <li key={entry.productId} className="flex items-baseline gap-x-1.5">
                <span className="min-w-0 truncate">{product.name}</span>
                <span className="shrink-0 text-stone-500 tabular-nums">×{entry.quantity}</span>
                <span
                  aria-hidden="true"
                  className="min-w-4 flex-1 border-b border-dotted border-stone-300"
                />
                <span className="shrink-0 font-bold tabular-nums">
                  {formatPrice(product.price * entry.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <div className="flex items-baseline justify-between gap-x-4 border-t border-dashed border-stone-300 pt-4">
            <span className="font-bold">Итого</span>
            <data
              value={totalPrice}
              className="font-display text-2xl font-extrabold tabular-nums sm:text-3xl"
            >
              {formatPrice(totalPrice)}
            </data>
          </div>

          <div className="flex flex-col gap-y-2">
            <Button disabled aria-describedby="checkout-note">
              Оформить заказ
            </Button>
            <p id="checkout-note" className="text-center text-xs text-stone-500">
              Оформление заказа скоро появится
            </p>
          </div>
        </Receipt.Body>
      </Receipt.Root>

      <Link
        to={{ pathname: routes.home, search: homeSearch }}
        className="flex items-center gap-x-2 self-center rounded-md px-2 py-1 text-sm font-bold text-stone-500 focus-ring transition-colors duration-150 hover:text-stone-900"
      >
        <ArrowIcon className="size-3" />
        Вернуться в меню
      </Link>
    </aside>
  );
};
