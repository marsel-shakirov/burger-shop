import type { CartEntry } from '../model/cart.types';

export interface CartResponse {
  items: CartEntry[];
}
