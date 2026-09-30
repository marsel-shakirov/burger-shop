import { Link } from 'react-router';

import { ProductCard } from '@/entities/product';
import { AddToCartButton } from '@/features/add-to-cart';
import { ToggleFavoriteButton } from '@/features/toggle-favorite';
import { routes } from '@/shared/config';
import { useLastSearch } from '@/shared/lib';
import { EmptyPlate } from '@/shared/ui/icon';

import { useCartSuggestions } from '../model/use-cart-suggestions';
import { CartHeader } from './cart-header';

export const EmptyCart = () => {
  const homeSearch = useLastSearch(routes.home);
  const suggestions = useCartSuggestions();

  return (
    <section className="flex flex-1 flex-col gap-y-5 pb-8 sm:gap-y-8 sm:pb-12">
      <CartHeader subtitle="Пока пусто" />

      <div className="flex flex-col items-center rounded-xl bg-white px-5 pt-8 pb-7 text-center shadow-(--shadow-base) sm:pt-12 sm:pb-10">
        <EmptyPlate className="w-44 sm:w-60" />

        <h2 className="mt-6 text-xl font-bold sm:text-2xl">Вы ещё ничего не выбрали</h2>
        <p className="mt-2 max-w-md text-balance text-stone-500">
          Добавьте бургер, напиток или чай из меню, и они появятся здесь
        </p>

        <Link
          to={{ pathname: routes.home, search: homeSearch }}
          className="mt-6 inline-flex h-12 items-center rounded-md bg-orange-500 px-6 font-bold text-stone-900 focus-ring transition-colors duration-150 hover:bg-orange-600"
        >
          Открыть меню
        </Link>
      </div>

      {suggestions.length > 0 && (
        <section aria-labelledby="cart-suggestions-title" className="flex flex-col gap-y-4">
          <h2 id="cart-suggestions-title" className="text-lg font-bold sm:text-xl">
            Чаще всего заказывают
          </h2>

          <ul role="list" className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {suggestions.map((product) => (
              <li key={product.id}>
                <ProductCard
                  product={product}
                  priority={false}
                  favoriteAction={<ToggleFavoriteButton variant="product" product={product} />}
                  action={<AddToCartButton product={product} />}
                />
              </li>
            ))}
          </ul>
        </section>
      )}
    </section>
  );
};
