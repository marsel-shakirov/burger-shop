import { LoadError } from '@/shared/ui/load-error';

import { useCartLines } from '../model/use-cart-lines';
import { CartList } from './cart-list';
import { CartSkeleton } from './cart-skeleton';
import { CartSummary } from './cart-summary';

export const CartBody = () => {
  const { isPending, isError, lines, totalPrice, retry } = useCartLines();

  if (isPending) return <CartSkeleton />;

  if (isError) {
    return (
      <LoadError
        message="Товары не загрузились"
        onRetry={retry}
        className="rounded-xl bg-white p-6 lg:col-span-2"
      />
    );
  }

  return (
    <>
      <CartList lines={lines} />
      <CartSummary lines={lines} totalPrice={totalPrice} />
    </>
  );
};
