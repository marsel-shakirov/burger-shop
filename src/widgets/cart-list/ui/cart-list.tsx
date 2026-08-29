import { useCartStore } from '@/entities/cart';
import { productsMock } from '@/entities/product';

import { CartItem } from './cart-item';

export const CartList = () => {
  const items = useCartStore((state) => state.items);

  return (
    <ul className="flex flex-1 flex-col gap-y-5">
      {items.map((entry) => {
        const product = productsMock.find((product) => product.id === entry.productId);

        if (!product) return null;

        return <CartItem key={entry.productId} product={product} entry={entry} />;
      })}
    </ul>
  );
};
