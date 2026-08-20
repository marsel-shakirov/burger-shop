import { type CartEntry, MAX_ITEM_QUANTITY, useCartStore } from '@/entities/cart';
import type { Product } from '@/entities/product';
import { RemoveItemIcon } from '@/shared/ui/icon';

import { QuantityControls } from './QuantityControls';

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
    <li className="border-t border-[#F4F4F4] pt-7">
      <article className="flex items-center justify-between">
        <div className="flex items-center gap-x-3">
          <img
            className="size-20 shrink-0 object-contain object-center"
            src={cartImage.png}
            alt={alt}
            width={81}
            height={81}
          />

          <div className="flex w-70 flex-col">
            <h2 className="line-clamp-2 text-[20px] leading-5 font-bold">{product.name}</h2>
            <p className="truncate text-lg leading-tight text-gray-400">{product.description}</p>
          </div>
        </div>

        <div className="inline-flex items-center justify-between gap-x-3">
          <QuantityControls
            onDecrease={() => decrementItem(productId)}
            onIncrease={() => incrementItem(productId)}
            quantity={quantity}
            max={MAX_ITEM_QUANTITY}
          />
        </div>

        <data className="min-w-20 text-center text-[22px] font-bold" value={price}>
          {price}&nbsp;₽
        </data>

        <button
          onClick={() => removeItem(productId)}
          className="cursor-pointer"
          type="button"
          aria-label="Удалить товар из корзины"
        >
          <RemoveItemIcon className="h-8 w-8 text-gray-400" />
        </button>
      </article>
    </li>
  );
};
