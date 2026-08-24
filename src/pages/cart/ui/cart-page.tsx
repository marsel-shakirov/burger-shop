import { useCartStore } from '@/entities/cart';
import { Container } from '@/shared/ui/container';

import { CartContent } from './cart-content';
import { EmptyCart } from './empty-cart';

export const CartPage = () => {
  const hasItems = useCartStore((state) => state.items.length > 0);

  return (
    <main className="flex flex-1">
      <Container className="flex flex-1 flex-col">
        {hasItems ? <CartContent /> : <EmptyCart />}
      </Container>
    </main>
  );
};
