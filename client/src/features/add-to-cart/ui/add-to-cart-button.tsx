import { type ComponentPropsWithoutRef, useEffect, useRef } from 'react';

import { MAX_ITEM_QUANTITY, selectProductQuantity, useCartStore } from '@/entities/cart';
import type { Product } from '@/entities/product';
import { QtyPlusIcon } from '@/shared/ui/icon';
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

  if (hasItems) {
    return (
      <QuantityControls
        className="h-9 justify-between rounded-md bg-orange-500 p-1 text-stone-900"
        quantity={quantity}
        max={MAX_ITEM_QUANTITY}
        onDecrease={handleDecrease}
        onIncrease={() => incrementItem(product.id)}
        increaseButtonRef={increaseButtonRef}
      />
    );
  }

  return (
    <button
      ref={addButtonRef}
      type="button"
      disabled={isMaxQuantity}
      data-product-id={product.id}
      aria-label={`Добавить ${product.name} в корзину, ${product.price} ₽`}
      onClick={handleAddItem}
      className="flex h-9 cursor-pointer items-center justify-between rounded-md bg-orange-500 py-1 pr-1 pl-3 text-stone-900 focus-ring disabled:opacity-50"
    >
      <span className="text-lg/5 font-extrabold">{product.price}&nbsp;₽</span>
      <QtyPlusIcon className="size-7" />
    </button>
  );
};
