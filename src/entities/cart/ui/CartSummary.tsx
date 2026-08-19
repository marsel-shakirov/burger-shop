import { CartIcon } from '@/shared/ui/icon';

import type { CartSummaryProps } from '../model/cart.types';

export const CartSummary = ({ price, quantity }: CartSummaryProps) => {
  return (
    <>
      <span className="">{price}&nbsp;₽</span>
      <span className="w-px bg-white/25"></span>
      <div className="flex gap-x-2">
        <CartIcon className="h-5 w-5" />
        {/* <span>Корзина</span> */}
        <span>{quantity}</span>
      </div>
    </>
  );
};
