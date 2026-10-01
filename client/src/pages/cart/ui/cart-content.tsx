import { selectClearCart, selectTotalQuantity, useCartStore } from '@/entities/cart';
import { formatItemsCount } from '@/shared/lib';
import { DeleteIcon } from '@/shared/ui/icon';

import { useCartLines } from '../model/use-cart-lines';
import { CartHeader } from './cart-header';
import { CartList } from './cart-list';
import { CartSkeleton } from './cart-skeleton';
import { CartSummary } from './cart-summary';

export const CartContent = () => {
  const totalQuantity = useCartStore(selectTotalQuantity);
  const clearCart = useCartStore(selectClearCart);
  const { isPending, isError, lines, totalPrice } = useCartLines();

  return (
    <section className="flex flex-1 flex-col gap-y-5 pb-8 sm:gap-y-8 sm:pb-12">
      <CartHeader
        subtitle={formatItemsCount(totalQuantity)}
        action={
          <button
            type="button"
            onClick={clearCart}
            className="flex shrink-0 cursor-pointer items-center gap-x-1 rounded-md text-xs font-bold text-stone-500 focus-ring transition-colors duration-150 hover:text-red-600 sm:text-base"
          >
            <DeleteIcon className="size-5" />
            Очистить корзину
          </button>
        }
      />

      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-8">
        {isPending ? (
          <CartSkeleton />
        ) : isError ? (
          <p role="alert" className="rounded-xl bg-white p-6 text-stone-600 lg:col-span-2">
            Не удалось загрузить товары. Обновите страницу, чтобы попробовать ещё раз.
          </p>
        ) : (
          <>
            <CartList lines={lines} />
            <CartSummary lines={lines} totalPrice={totalPrice} />
          </>
        )}
      </div>
    </section>
  );
};
