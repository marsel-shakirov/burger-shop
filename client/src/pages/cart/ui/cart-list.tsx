import type { CartLine } from '../model/use-cart-lines';
import { CartItem } from './cart-item';

interface CartListProps {
  lines: CartLine[];
}

export const CartList = ({ lines }: CartListProps) => {
  console.log(lines);
  return (
    <ul role="list" className="rounded-xl bg-white shadow-(--shadow-base)">
      {lines.map(({ product, entry }) => (
        <CartItem key={entry.productId} product={product} entry={entry} />
      ))}
    </ul>
  );
};
