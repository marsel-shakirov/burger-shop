import type { ComponentPropsWithoutRef } from 'react';

import { MAX_ITEM_QUANTITY, selectProductQuantity, useCartStore } from '@/entities/cart';
import type { Product } from '@/entities/product';
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

  const handleAddItem = () => {
    addItem({
      productId: product.id,
      unitPrice: product.price,
    });
  };

  if (hasItems) {
    return (
      <QuantityControls
        className="justify-between rounded-md bg-orange-500/90 p-1 text-white"
        quantity={quantity}
        max={MAX_ITEM_QUANTITY}
        onDecrease={() => decrementItem(product.id)}
        onIncrease={() => incrementItem(product.id)}
      />
    );
  }

  return (
    <>
      <button
        type="button"
        disabled={isMaxQuantity}
        data-product-id={product.id}
        aria-label={`Добавить ${product.name} в корзину`}
        onClick={handleAddItem}
        className="inline-flex cursor-pointer items-center justify-center rounded-md bg-linear-to-tl from-orange-500 to-amber-500 p-2 font-bold text-white focus-ring disabled:opacity-50"
      >
        <span className="">Добавить</span>
      </button>
    </>
  );
};
