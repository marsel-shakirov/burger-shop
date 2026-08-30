import type { ComponentPropsWithoutRef } from 'react';

import { MAX_ITEM_QUANTITY, selectProductQuantity, useCartStore } from '@/entities/cart';
import type { Product } from '@/entities/product';
import { PlusIcon } from '@/shared/ui/icon';
import { QuantityBadge } from '@/shared/ui/quantity-badge';

interface AddToCartButtonProps extends Omit<ComponentPropsWithoutRef<'button'>, 'children'> {
  product: Product;
}

export const AddToCartButton = ({ product }: AddToCartButtonProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const quantity = useCartStore(selectProductQuantity(product.id));
  const hasItems = quantity > 0;
  const isMaxQuantity = quantity >= MAX_ITEM_QUANTITY;

  const handleAddItem = () => {
    addItem({
      productId: product.id,
      unitPrice: product.price,
    });
  };

  return (
    <button
      type="button"
      disabled={isMaxQuantity}
      data-product-id={product.id}
      onClick={handleAddItem}
      className="inline-flex cursor-pointer items-center justify-center gap-x-1.5 bg-transparent font-bold text-orange-500 disabled:opacity-50"
    >
      <div className="relative size-8 rounded-full border-2 border-orange-500 p-1.5">
        <PlusIcon className="h-auto w-full" />
        {hasItems && (
          <QuantityBadge
            quantity={quantity}
            className="absolute top-0 right-0 size-4 translate-x-1/3 -translate-y-1/4 bg-orange-500"
          />
        )}
      </div>
      <span className="sr-only min-[550px]:not-sr-only md:text-[0.75rem]">Добавить</span>
    </button>
  );
};
