import { useCartItems } from '@/entities/cart';
import { useProductsById } from '@/entities/product';

import { getCartLines, getCartTotalPrice } from '../lib/get-cart-lines';

export const useCartLines = () => {
  const cart = useCartItems();
  const products = useProductsById();

  const isPending = cart.isPending || products.isPending;
  const isError = cart.isError || products.isError;

  const lines = getCartLines(cart.items, products.data);
  const totalPrice = getCartTotalPrice(lines);

  return { isPending, isError, lines, totalPrice };
};
