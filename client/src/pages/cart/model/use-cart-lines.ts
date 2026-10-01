import { type CartEntry, selectCartItems, useCartStore } from '@/entities/cart';
import { type Product, useProductsById } from '@/entities/product';

export interface CartLine {
  product: Product;
  entry: CartEntry;
}

export const useCartLines = () => {
  const entries = useCartStore(selectCartItems);

  const { isPending, isError, data: productsById } = useProductsById();

  const lines = entries.flatMap((entry): CartLine[] => {
    const product = productsById?.get(entry.productId);

    return product ? [{ product, entry }] : [];
  });

  const totalPrice = lines.reduce(
    (total, { product, entry }) => total + product.price * entry.quantity,
    0,
  );

  return { isPending, isError, lines, totalPrice };
};
