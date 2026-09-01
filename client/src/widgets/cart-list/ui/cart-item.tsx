import { type CartEntry, MAX_ITEM_QUANTITY, useCartStore } from '@/entities/cart';
import type { Product } from '@/entities/product';
import { RemoveItemIcon } from '@/shared/ui/icon';
import { getImageUrl } from '@/shared/utils/getImagesUrl';

import { QuantityControls } from './quantity-controls';

interface CartItemProps {
  product: Product;
  entry: CartEntry;
}

export const CartItem = ({ product, entry }: CartItemProps) => {
  const price = entry.unitPrice * entry.quantity;

  const decrementItem = useCartStore((state) => state.decrementItem);
  const incrementItem = useCartStore((state) => state.incrementItem);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <li className="border-neutral-100 not-first:border-t">
      <article className="flex flex-col items-center justify-center gap-x-3 p-1.5 min-[500px]:justify-between sm:flex-row">
        <div className="flex items-center gap-x-2">
          <img
            width={90}
            height={90}
            src={getImageUrl(product.image.cart.path)}
            alt={product.image.alt}
            className="aspect-square w-[clamp(90px,12vw,140px)] object-contain"
          />

          <div className="flex flex-col justify-between">
            <h3 className="line-clamp-2 leading-5 font-bold">{product.name}</h3>
            <p className="line-clamp-1 text-gray-400">{product.description}</p>
            <span className="font-bold text-gray-400">{product.price}&nbsp;₽ за шт.</span>
          </div>
        </div>

        <div className="flex items-center gap-x-4 sm:gap-1">
          <div className="inline-flex items-center justify-between gap-x-3">
            <QuantityControls
              onDecrease={() => decrementItem(entry.productId)}
              onIncrease={() => incrementItem(entry.productId)}
              quantity={entry.quantity}
              max={MAX_ITEM_QUANTITY}
            />
          </div>

          <data className="min-w-15 text-center font-bold md:text-lg" value={price}>
            {price}&nbsp;₽
          </data>

          <button
            onClick={() => removeItem(entry.productId)}
            className="cursor-pointer"
            type="button"
            aria-label="Удалить товар из корзины"
          >
            <RemoveItemIcon className="size-6 text-gray-400 md:size-8" />
          </button>
        </div>
      </article>
    </li>
  );
};
