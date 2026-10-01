export interface CartEntry {
  productId: number;
  quantity: number;
}

export type CartItemPayload = CartEntry['productId'];

export interface CartState {
  items: CartEntry[];
  addItem: (productId: CartItemPayload) => void;
  incrementItem: (productId: CartItemPayload) => void;
  decrementItem: (productId: CartItemPayload) => void;
  removeItem: (productId: CartItemPayload) => void;
  clearCart: () => void;
}
