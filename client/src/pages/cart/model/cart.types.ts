import type { CartEntry } from '@/entities/cart';
import type { Product } from '@/entities/product';

export interface CartLine {
  product: Product;
  entry: CartEntry;
}
