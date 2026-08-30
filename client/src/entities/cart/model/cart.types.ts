export interface CartEntry {
  productId: number;
  quantity: number;
  unitPrice: number;
}

export type AddCartItemPayload = Pick<CartEntry, 'productId' | 'unitPrice'>;

export type CartItemPayload = CartEntry['productId'];

export interface CartState {
  items: CartEntry[];
  addItem: (product: AddCartItemPayload) => void;
  incrementItem: (productId: CartItemPayload) => void;
  decrementItem: (productId: CartItemPayload) => void;
  removeItem: (productId: CartItemPayload) => void;
  clearCart: () => void;
}
