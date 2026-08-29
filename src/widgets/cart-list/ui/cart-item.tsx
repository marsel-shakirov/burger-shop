import { type CartEntry, MAX_ITEM_QUANTITY, useCartStore } from '@/entities/cart';
import type { Product } from '@/entities/product';
import { RemoveItemIcon } from '@/shared/ui/icon';

import { QuantityControls } from './quantity-controls';

interface CartItemProps {
  product: Product;
  productId: CartEntry['productId'];
  quantity: CartEntry['quantity'];
}

export const CartItem = ({ product, productId, quantity }: CartItemProps) => {
  const price = product.price * quantity;
  const { cart: cartImage, alt } = product.image;
  const { decrementItem, incrementItem, removeItem } = useCartStore((state) => state);

  return (
    <li className="border-neutral-100 not-first:border-t">
      <article className="flex flex-col items-center justify-center gap-x-3 p-1.5 min-[500px]:justify-between sm:flex-row">
        <div className="flex items-center gap-x-2">
          <img
            className="aspect-square w-[clamp(90px,12vw,140px)] object-contain"
            src={cartImage.png}
            alt={alt}
            width={90}
            height={90}
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
              onDecrease={() => decrementItem(productId)}
              onIncrease={() => incrementItem(productId)}
              quantity={quantity}
              max={MAX_ITEM_QUANTITY}
            />
          </div>

          <data className="min-w-15 text-center font-bold md:text-lg" value={price}>
            {price}&nbsp;₽
          </data>

          <button
            onClick={() => removeItem(productId)}
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
