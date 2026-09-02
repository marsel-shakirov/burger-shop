import { useQuery } from '@tanstack/react-query';

import { selectCartItems, useCartStore } from '@/entities/cart';
import { productsQueryOptions } from '@/entities/product';

import { CartItem } from './cart-item';

export const CartList = () => {
  const items = useCartStore(selectCartItems);

  const { isPending, isError, data } = useQuery(productsQueryOptions('all'));

  if (isPending) {
    return <div>Loading products</div>;
  }

  if (isError) {
    return <div>Failed to load products</div>;
  }

  return (
    <ul className="flex flex-1 flex-col gap-y-5">
      {items.map((entry) => {
        const product = data.find((product) => product.id === entry.productId);

        if (!product) return null;

        return <CartItem key={entry.productId} product={product} entry={entry} />;
      })}
    </ul>
  );
};
