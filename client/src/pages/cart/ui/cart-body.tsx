import { LoadError } from '@/shared/ui/load-error';

import { useCartLines } from '../model/use-cart-lines';
import { CartItem } from './cart-item';
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
      <ul role="list" className="rounded-xl bg-white shadow-(--shadow-base)">
        {lines.map(({ product, entry }) => (
          <CartItem key={entry.productId} product={product} entry={entry} />
        ))}
      </ul>
      <CartSummary lines={lines} totalPrice={totalPrice} />
    </>
  );
};
