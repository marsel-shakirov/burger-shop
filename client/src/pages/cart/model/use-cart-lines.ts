import { type CartEntry, useCartItems } from '@/entities/cart';
import { type Product, useProductsById } from '@/entities/product';

export interface CartLine {
  product: Product;
  entry: CartEntry;
}

export const useCartLines = () => {
  const cart = useCartItems();
  const products = useProductsById();

  const isPending = cart.isPending || products.isPending;
  const isError = cart.isError || products.isError;

  const lines = cart.items.flatMap((entry): CartLine[] => {
    const product = products.data?.get(entry.productId);

    return product ? [{ product, entry }] : [];
  });

  const totalPrice = lines.reduce(
    (total, { product, entry }) => total + product.price * entry.quantity,
    0,
  );

  return { isPending, isError, lines, totalPrice };
};
