import { useId } from 'react';

import { ProductCard } from '@/entities/product';
import { AddToCartButton } from '@/features/add-to-cart';
import { ToggleFavoriteButton } from '@/features/toggle-favorite';

import { useCartSuggestions } from '../model/use-cart-suggestions';

export const CartSuggestions = () => {
  const suggestions = useCartSuggestions();
  const titleId = useId();

  if (suggestions.length === 0) return null;

  return (
    <section aria-labelledby={titleId} className="flex flex-col gap-y-4">
      <h2 id={titleId} className="text-lg font-bold sm:text-xl">
        Чаще всего заказывают
      </h2>

      <ul role="list" className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {suggestions.map((product) => (
          <li key={product.id}>
            <ProductCard
              product={product}
              priority={false}
              favoriteAction={<ToggleFavoriteButton variant="product" product={product} />}
              cartAction={<AddToCartButton product={product} />}
            />
          </li>
        ))}
      </ul>
    </section>
  );
};
