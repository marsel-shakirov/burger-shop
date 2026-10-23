import { useCartLines } from '../model/use-cart-lines';
import { CartList } from './cart-list';
import { CartSkeleton } from './cart-skeleton';
import { CartSummary } from './cart-summary';

export const CartBody = () => {
  const { isPending, isError, lines, totalPrice } = useCartLines();

  if (isPending) return <CartSkeleton />;

  if (isError) {
    return (
      <p role="alert" className="rounded-xl bg-white p-6 text-stone-600 lg:col-span-2">
        Не удалось загрузить товары. Обновите страницу, чтобы попробовать ещё раз.
      </p>
    );
  }

  return (
    <>
      <CartList lines={lines} />
      <CartSummary lines={lines} totalPrice={totalPrice} />
    </>
  );
};
