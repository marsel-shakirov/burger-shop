import { selectHasItems, useCartStore } from '@/entities/cart';
import { Container } from '@/shared/ui/container';
import { PageMeta } from '@/shared/ui/page-meta';

import { CartContent } from './cart-content';
import { EmptyCart } from './empty-cart';

export const CartPage = () => {
  const hasItems = useCartStore(selectHasItems);

  return (
    <main className="flex flex-1">
      <PageMeta title="Корзина" noindex />
      <Container className="flex flex-1 flex-col">
        {hasItems ? <CartContent /> : <EmptyCart />}
      </Container>
    </main>
  );
};
