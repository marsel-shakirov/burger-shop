import { type CartEntry, MAX_ITEM_QUANTITY, useCartStore } from '@/entities/cart';
import { type Product, PRODUCT_UNIT_LABEL } from '@/entities/product';
import { ToggleFavoriteButton } from '@/features/toggle-favorite';
import { formatPrice } from '@/shared/lib';
import { DeleteIcon } from '@/shared/ui/icon';
import { QuantityControls } from '@/shared/ui/quantity-controls';

interface CartItemProps {
  product: Product;
  entry: CartEntry;
}

export const CartItem = ({ product, entry }: CartItemProps) => {
  const linePrice = product.price * entry.quantity;

  const decrementItem = useCartStore((state) => state.decrementItem);
  const incrementItem = useCartStore((state) => state.incrementItem);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <li className="grid grid-cols-[auto_minmax(0,1fr)_auto] gap-3 border-stone-100 p-3 not-first:border-t sm:grid-cols-[auto_minmax(0,1fr)_auto_minmax(7rem,auto)_auto] sm:items-center sm:gap-x-5 sm:p-4">
      <div className="relative flex w-18 items-end justify-center self-start pt-1 sm:row-start-1 sm:w-24 sm:pt-0">
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[26%] rounded-[50%] bg-stone-200/80 shadow-[inset_0_-2px_0_rgb(0_0_0/0.05)]"
        />
        <img
          width={96}
          height={96}
          src={product.imageUrl}
          alt=""
          className="relative size-16 object-contain drop-shadow-[0_4px_3px_rgb(0_0_0/0.18)] sm:size-22"
        />
      </div>

      <div className="flex flex-col gap-y-0.5 leading-tight sm:row-start-1">
        <h2 className="line-clamp-2 font-bold">{product.name}</h2>

        <p className="text-xs leading-tight text-stone-500">
          {`${product.amount} ${PRODUCT_UNIT_LABEL[product.unit]}`}
        </p>
        <p className="text-sm leading-tight font-bold text-stone-600 tabular-nums">
          {`${formatPrice(product.price)} за шт`}
        </p>
      </div>

      <div className="inline-flex gap-x-2.5 sm:col-start-5 sm:row-start-1 sm:mt-0">
        <ToggleFavoriteButton variant="cart" product={product} />
        <button
          type="button"
          onClick={() => removeItem(entry.productId)}
          className="grid size-7 cursor-pointer place-items-center rounded-md bg-stone-100 text-stone-400 focus-ring transition-colors duration-150 hover:bg-stone-200 hover:text-red-600"
          aria-label={`Удалить ${product.name} из корзины`}
        >
          <DeleteIcon className="size-5" />
        </button>
      </div>

      <div className="col-span-3 flex items-center justify-between gap-x-3 sm:contents">
        <QuantityControls
          variant="soft"
          className="h-9 w-28 shrink-0 justify-between rounded-full bg-stone-100 px-1 sm:col-start-3 sm:row-start-1"
          quantity={entry.quantity}
          max={MAX_ITEM_QUANTITY}
          onDecrease={() => decrementItem(entry.productId)}
          onIncrease={() => incrementItem(entry.productId)}
        />

        <div className="text-right sm:col-start-4 sm:row-start-1">
          <data value={linePrice} className="font-display text-lg font-bold tabular-nums">
            {formatPrice(linePrice)}
          </data>
        </div>
      </div>
    </li>
  );
};
