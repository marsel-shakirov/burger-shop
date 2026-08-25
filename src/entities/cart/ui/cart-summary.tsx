import { CartIcon } from '@/shared/ui/icon';

import { selectTotalPrice, selectTotalQuantity } from '../model/cart.selectors';
import { useCartStore } from '../model/cart.store';

export const CartSummary = () => {
  const totalPrice = useCartStore(selectTotalPrice);
  const totalQuantity = useCartStore(selectTotalQuantity);
  const hasItems = totalPrice > 0 && totalQuantity > 0;

  return (
    <>
      <div className="relative">
        <CartIcon className="size-[clamp(1.25rem,5vw,2rem)] shrink-0" />
        {hasItems && (
          <span className="absolute -top-1 -right-1.75 grid size-[clamp(1rem,4vw,1.25rem)] shrink-0 place-items-center rounded-full border border-orange-500 bg-red-600 p-0.5 text-[clamp(0.5rem,2vw,0.62rem)] leading-0 font-bold">
            {totalQuantity}
          </span>
        )}
      </div>
      <span className="text-[clamp(10px,3vw,18px)]">Корзина</span>
    </>
  );
};
