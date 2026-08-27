import { CartIcon } from '@/shared/ui/icon';
import { QuantityBadge } from '@/shared/ui/quantity-badge';

import { selectTotalPrice, selectTotalQuantity } from '../model/cart.selectors';
import { useCartStore } from '../model/cart.store';

export const CartSummary = () => {
  const totalPrice = useCartStore(selectTotalPrice);
  const totalQuantity = useCartStore(selectTotalQuantity);
  const hasItems = totalPrice > 0 && totalQuantity > 0;

  return (
    <>
      <div className="relative size-[clamp(32px,7vw,44px)] rounded-full bg-orange-500 p-1.5 text-white">
        <CartIcon className="h-auto w-full object-cover" />
        {hasItems && (
          <QuantityBadge
            quantity={totalQuantity}
            className="absolute -top-1 -right-1.5 size-[clamp(15px,3vw,18px)] bg-red-600"
          />
        )}
      </div>
      <div className="flex flex-col">
        <span className="text-[clamp(10px,3vw,18px)] font-thin opacity-50">Корзина</span>
        <span className="text-[clamp(10px,3vw,18px)] font-bold">{totalPrice}&nbsp;₽.</span>
      </div>
    </>
  );
};
