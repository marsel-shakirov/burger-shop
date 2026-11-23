import { useCartItems } from '@/entities/cart';
import { Container } from '@/shared/ui/container';
import { PageMeta } from '@/shared/ui/page-meta';

import { CartContent } from './cart-content';
import { CartSuggestions } from './cart-suggestions';
import { EmptyCart } from './empty-cart';

export const CartPage = () => {
  const { items, isPending, isError } = useCartItems();
  const isEmpty = !isPending && !isError && items.length === 0;

  return (
    <main className="flex flex-1">
      <PageMeta title="Корзина" noindex />
      <Container className="flex flex-1 flex-col">
        {isEmpty ? <EmptyCart /> : <CartContent />}
        <CartSuggestions />
      </Container>
    </main>
  );
};
