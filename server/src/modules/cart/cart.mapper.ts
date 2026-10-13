import type { CartItem, CartItemRow } from './cart.types.ts';

export interface CartResponse {
  items: CartItem[];
}

export function toCartResponse(rows: CartItemRow[]): CartResponse {
  return {
    items: rows.map((row) => ({ productId: row.product_id, quantity: row.quantity })),
  };
}
