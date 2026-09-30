import { useQuery } from '@tanstack/react-query';

import { type CartEntry, selectCartItems, useCartStore } from '@/entities/cart';
import { ALL_PRODUCTS_PARAMS, type Product, productsQueryOptions } from '@/entities/product';

export interface CartLine {
  product: Product;
  entry: CartEntry;
}

export const useCartLines = () => {
  const entries = useCartStore(selectCartItems);

  const {
    isPending,
    isError,
    data: products,
  } = useQuery(productsQueryOptions(ALL_PRODUCTS_PARAMS));

  const productsById = new Map(products?.map((product) => [product.id, product]));
  const lines = entries.flatMap((entry): CartLine[] => {
    const product = productsById.get(entry.productId);

    return product ? [{ product, entry }] : [];
  });

  return { isPending, isError, lines };
};
