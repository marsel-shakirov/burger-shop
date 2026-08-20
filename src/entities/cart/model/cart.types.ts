export interface CartItem {
  productId: number;
  quantity: number;
  unitPrice: number;
}

export type AddCartItemPayload = Pick<CartItem, 'productId' | 'unitPrice'>;

export interface CartState {
  items: CartItem[];
  addItem: (product: AddCartItemPayload) => void;
}
