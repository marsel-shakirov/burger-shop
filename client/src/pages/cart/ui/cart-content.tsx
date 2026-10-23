import { useCartTotalQuantity } from '@/entities/cart';
import { formatItemsCount } from '@/entities/product';

import { CartBody } from './cart-body';
import { CartHeader } from './cart-header';
import { ClearCartButton } from './clear-cart-button';

export const CartContent = () => {
  const { totalQuantity, isPending } = useCartTotalQuantity();

  return (
    <section className="flex flex-1 flex-col gap-y-5 pb-8 sm:gap-y-8 sm:pb-12">
      <CartHeader
        subtitle={isPending ? 'Загружаем…' : formatItemsCount(totalQuantity)}
        action={<ClearCartButton />}
      />

      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-8">
        <CartBody />
      </div>
    </section>
  );
};
