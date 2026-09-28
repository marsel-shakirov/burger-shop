import { type ComponentPropsWithoutRef, useEffect, useRef } from 'react';

import { MAX_ITEM_QUANTITY, selectProductQuantity, useCartStore } from '@/entities/cart';
import type { Product } from '@/entities/product';
import { PlusIcon } from '@/shared/ui/icon';
import { QuantityControls } from '@/shared/ui/quantity-controls';

interface AddToCartButtonProps extends Omit<ComponentPropsWithoutRef<'button'>, 'children'> {
  product: Product;
}

export const AddToCartButton = ({ product }: AddToCartButtonProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const quantity = useCartStore(selectProductQuantity(product.id));
  const decrementItem = useCartStore((state) => state.decrementItem);
  const incrementItem = useCartStore((state) => state.incrementItem);
  const hasItems = quantity > 0;
  const isMaxQuantity = quantity >= MAX_ITEM_QUANTITY;

  const addButtonRef = useRef<HTMLButtonElement>(null);
  const increaseButtonRef = useRef<HTMLButtonElement>(null);
  const shouldMoveFocusRef = useRef(false);

  useEffect(() => {
    if (!shouldMoveFocusRef.current) return;
    shouldMoveFocusRef.current = false;
    (hasItems ? increaseButtonRef : addButtonRef).current?.focus();
  }, [hasItems]);

  const handleAddItem = () => {
    shouldMoveFocusRef.current = true;
    addItem({
      productId: product.id,
      unitPrice: product.price,
    });
  };

  const handleDecrease = () => {
    if (quantity === 1) shouldMoveFocusRef.current = true;
    decrementItem(product.id);
  };

  return (
    <div
      className={`relative h-9 rounded-md bg-stone-100 ring-1 ring-stone-200 transition-colors duration-150 ring-inset ${
        hasItems ? '' : 'hover:bg-stone-200'
      }`}
    >
      <span
        aria-hidden="true"
        className={`absolute bg-orange-500 transition-all duration-200 ease-out motion-reduce:transition-none ${
          hasItems ? 'inset-y-0 right-0 w-full rounded-md' : 'inset-y-1 right-1 w-7 rounded-[5px]'
        }`}
      />

      {hasItems ? (
        <QuantityControls
          variant="solid"
          className="relative size-full justify-between p-1 text-stone-900"
          quantity={quantity}
          max={MAX_ITEM_QUANTITY}
          onDecrease={handleDecrease}
          onIncrease={() => incrementItem(product.id)}
          increaseButtonRef={increaseButtonRef}
        />
      ) : (
        <button
          ref={addButtonRef}
          type="button"
          disabled={isMaxQuantity}
          data-product-id={product.id}
          aria-label={`Добавить ${product.name} в корзину, ${product.price} ₽`}
          onClick={handleAddItem}
          className="relative flex size-full cursor-pointer items-center justify-between rounded-md py-1 pr-1 pl-3 text-stone-900 focus-ring disabled:opacity-50"
        >
          <span className="text-lg/5 font-extrabold">{product.price}&nbsp;₽</span>
          <span className="grid size-7 place-items-center">
            <PlusIcon className="size-3" />
          </span>
        </button>
      )}
    </div>
  );
};
