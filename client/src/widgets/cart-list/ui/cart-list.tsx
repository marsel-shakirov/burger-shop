import { useQueryClient } from '@tanstack/react-query';

import { useCartStore } from '@/entities/cart';
import { type Product } from '@/entities/product';

import { CartItem } from './cart-item';

export const CartList = () => {
  const items = useCartStore((state) => state.items);

  const queryClient = useQueryClient();

  const data = queryClient.getQueryData<Product[]>(['products', 'all']);

  return (
    <ul className="flex flex-1 flex-col gap-y-5">
      {items.map((entry) => {
        const product = data && data.find((product) => product.id === entry.productId);

        if (!product) return null;

        return <CartItem key={entry.productId} product={product} entry={entry} />;
      })}
    </ul>
  );
};
