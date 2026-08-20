import { CartItem, useCartStore } from '@/entities/cart';
import { productsMock } from '@/entities/product';

export const CartList = () => {
  const items = useCartStore((state) => state.items);

  return (
    <ul className="flex flex-1 flex-col gap-y-7">
      {items.map((entry) => {
        const product = productsMock.find((product) => product.id === entry.productId);

        if (!product) return null;

        return (
          <CartItem
            key={entry.productId}
            product={product}
            productId={entry.productId}
            quantity={entry.quantity}
          />
        );
      })}
    </ul>
  );
};
