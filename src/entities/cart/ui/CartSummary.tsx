import { CartIcon } from '@/shared/ui/icon';

import { selectTotalPrice, selectTotalQuantity } from '../model/cart.selectors';
import { useCartStore } from '../model/cart.store';

export const CartSummary = () => {
  const totalPrice = useCartStore(selectTotalPrice);
  const totalQuantity = useCartStore(selectTotalQuantity);
  const hasItems = totalPrice > 0 && totalQuantity > 0;

  return (
    <>
      {hasItems && (
        <>
          <span>{totalPrice}&nbsp;₽</span>
          <span className="w-px bg-white/25" />
        </>
      )}

      <div className="flex gap-x-2">
        <CartIcon className="h-5 w-5" />
        <span>{hasItems ? totalQuantity : 'Корзина'}</span>
      </div>
    </>
  );
};
