type OrderStatus = 'new' | 'accepted' | 'ready' | 'completed' | 'cancelled';

interface OrderSummary {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  totalPrice: number;
  createdAt: string;
}

export interface OrderHistoryPage {
  items: OrderSummary[];
  nextCursor: string | null;
}

export interface OrderDetails extends OrderSummary {
  items: {
    lineNumber: number;
    productName: string;
    unitPrice: number;
    quantity: number;
  }[];
}
