import type { CartEntry } from '@/entities/cart';
import type { Product } from '@/entities/product';

import type { CartLine } from '../model/cart.types';

export const getCartLines = (
  entries: CartEntry[],
  productsById: ReadonlyMap<Product['id'], Product> | undefined,
) =>
  entries.flatMap((entry): CartLine[] => {
    const product = productsById?.get(entry.productId);

    return product ? [{ product, entry }] : [];
  });

export const getCartTotalPrice = (lines: CartLine[]) =>
  lines.reduce((total, { product, entry }) => total + product.price * entry.quantity, 0);
