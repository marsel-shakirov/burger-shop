import { Link } from 'react-router';

import { useCartItems, useGuestCartMerge } from '@/entities/cart';
import { routes } from '@/shared/config';
import { formatItemsCount } from '@/shared/lib';
import { buttonClass } from '@/shared/ui/button';
import { Container } from '@/shared/ui/container';
import { LoadError } from '@/shared/ui/load-error';
import { PageMeta } from '@/shared/ui/page-meta';

const CheckoutCart = () => {
  const cart = useCartItems();

  if (cart.isPending) return <p role="status">Загружаем корзину…</p>;

  if (cart.isError) {
    return <LoadError message="Не удалось загрузить корзину" onRetry={cart.refetch} />;
  }

  if (cart.items.length === 0) {
    return (
      <>
        <p className="text-stone-600">В корзине пока пусто</p>
        <Link className={buttonClass} to={routes.home}>
          Открыть меню
        </Link>
      </>
    );
  }

  const quantity = cart.items.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <p className="text-stone-600">В корзине {formatItemsCount(quantity)}</p>
      <Link className={buttonClass} to={routes.cart}>
        Вернуться в корзину
      </Link>
    </>
  );
};

export const CheckoutPage = () => {
  const merge = useGuestCartMerge();

  return (
    <main className="flex flex-1">
      <PageMeta title="Оформление заказа" noindex />
      <Container className="flex flex-col items-start gap-5 pt-4 pb-8 sm:pt-7">
        <h1 className="text-2xl font-bold sm:text-4xl">Оформление заказа</h1>
        {merge.isFetching || merge.isPending ? (
          <p role="status">Подготавливаем корзину…</p>
        ) : merge.isError ? (
          <LoadError
            message="Не удалось перенести гостевую корзину"
            onRetry={() => void merge.refetch()}
          />
        ) : (
          <CheckoutCart />
        )}
      </Container>
    </main>
  );
};
