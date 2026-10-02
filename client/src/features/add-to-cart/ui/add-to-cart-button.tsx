import { useEffect, useRef } from 'react';

import {
  MAX_ITEM_QUANTITY,
  selectAddItem,
  selectDecrementItem,
  selectIncrementItem,
  selectProductQuantity,
  useCartStore,
} from '@/entities/cart';
import type { Product } from '@/entities/product';
import { formatPrice } from '@/shared/lib';
import { PlusIcon } from '@/shared/ui/icon';
import { QuantityControls } from '@/shared/ui/quantity-controls';

type Variant = 'card' | 'details';

interface AddToCartButtonProps {
  product: Product;
  variant?: Variant;
}

const styles: Record<
  Variant,
  {
    root: string;
    slider: string;
    sliderIdle: string;
    button: string;
    price: string;
    mark: string;
    controls: string;
    controlsVariant: 'solid' | 'solid-large';
  }
> = {
  card: {
    root: 'h-9 rounded-md',
    slider: 'rounded-md',
    sliderIdle: 'inset-y-1 right-1 w-7 rounded-[5px] group-hover/add:w-9',
    button: 'rounded-md py-1 pr-1 pl-3',
    price: 'text-base',
    mark: 'grid size-7 place-items-center transition-transform duration-200 ease-out group-hover/add:-translate-x-1 motion-reduce:transition-none',
    controls: 'p-1',
    controlsVariant: 'solid',
  },
  details: {
    root: 'h-14 rounded-[14px]',
    slider: 'rounded-[14px]',
    sliderIdle: 'inset-y-1.5 right-1.5 w-36 rounded-[10px]',
    button: 'rounded-[14px] py-1.5 pr-1.5 pl-5',
    price: 'text-xl',
    mark: 'flex h-full w-36 items-center justify-center gap-x-2.5 font-bold',
    controls: 'p-1.5',
    controlsVariant: 'solid-large',
  },
};

export const AddToCartButton = ({ product, variant = 'card' }: AddToCartButtonProps) => {
  const quantity = useCartStore(selectProductQuantity(product.id));
  const addItem = useCartStore(selectAddItem);
  const incrementItem = useCartStore(selectIncrementItem);
  const decrementItem = useCartStore(selectDecrementItem);

  const hasItems = quantity > 0;
  const isDetails = variant === 'details';
  const price = formatPrice(product.price);
  const s = styles[variant];

  const addButtonRef = useRef<HTMLButtonElement>(null);
  const increaseButtonRef = useRef<HTMLButtonElement>(null);
  const shouldMoveFocusRef = useRef(false);

  useEffect(() => {
    if (!shouldMoveFocusRef.current) return;
    shouldMoveFocusRef.current = false;
    (hasItems ? increaseButtonRef : addButtonRef).current?.focus();
  }, [hasItems]);

  const handleAdd = () => {
    shouldMoveFocusRef.current = true;
    addItem(product.id);
  };

  const handleIncrease = () => incrementItem(product.id);

  const handleDecrease = () => {
    if (quantity === 1) shouldMoveFocusRef.current = true;
    decrementItem(product.id);
  };

  return (
    <div
      className={`group/add relative bg-stone-100 ring-1 ring-stone-200 transition-colors duration-150 ring-inset ${s.root} ${
        hasItems ? '' : 'hover:bg-stone-200'
      }`}
    >
      <span
        aria-hidden="true"
        className={`absolute bg-orange-500 transition-all duration-200 ease-out motion-reduce:transition-none ${
          hasItems
            ? `inset-y-0 right-0 w-full ${s.slider}`
            : `${s.sliderIdle} group-hover/add:bg-orange-600`
        }`}
      />

      {hasItems ? (
        <QuantityControls
          variant={s.controlsVariant}
          className={`relative size-full justify-between text-stone-900 ${s.controls}`}
          quantity={quantity}
          max={MAX_ITEM_QUANTITY}
          onDecrease={handleDecrease}
          onIncrease={handleIncrease}
          increaseButtonRef={increaseButtonRef}
        >
          {isDetails ? (
            <span className="flex flex-col items-center gap-y-px">
              <span className="font-display">{formatPrice(product.price * quantity)}</span>
              <span className="text-[0.8125rem] font-medium">{`${quantity} шт в корзине`}</span>
            </span>
          ) : undefined}
        </QuantityControls>
      ) : (
        <button
          ref={addButtonRef}
          type="button"
          aria-label={`Добавить ${product.name} в корзину, ${price}`}
          onClick={handleAdd}
          className={`relative flex size-full cursor-pointer items-center justify-between text-stone-900 focus-ring ${s.button}`}
        >
          <span className={`font-display font-extrabold tabular-nums ${s.price}`}>{price}</span>
          <span className={s.mark}>
            {isDetails && 'Добавить'}
            <PlusIcon className="size-3" />
          </span>
        </button>
      )}
    </div>
  );
};
