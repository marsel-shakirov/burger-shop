import { formatPrice } from '@/shared/lib';

interface CartLineTotalProps {
  price: number;
  quantity: number;
}

export const CartLineTotal = ({ price, quantity }: CartLineTotalProps) => (
  <span className="flex flex-col items-center gap-y-px">
    <span className="font-display">{formatPrice(price * quantity)}</span>
    <span className="text-[0.8125rem] font-medium">{`${quantity} шт в корзине`}</span>
  </span>
);
