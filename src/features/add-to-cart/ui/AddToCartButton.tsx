import { selectProductQuantity, useCartStore } from '@/entities/cart';
import { PlusIcon } from '@/shared/ui/icon';

import type { AddToCartButtonProps } from '../model/add-to-cart.types';

export const AddToCartButton = ({ product }: AddToCartButtonProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const quantity = useCartStore(selectProductQuantity(product.id));

  const handleAddItem = () => {
    addItem({
      productId: product.id,
      unitPrice: product.price,
    });
  };

  return (
    <button
      type="button"
      data-product-id={product.id}
      onClick={handleAddItem}
      className="inline-flex cursor-pointer items-center gap-x-1.5 rounded-4xl border border-orange-500 bg-transparent px-2 py-2 font-bold text-orange-500"
    >
      <PlusIcon className="h-3 w-3" />
      <span className="">Добавить</span>
      {quantity > 0 && (
        <span className="flex shrink-0 basis-6 items-center justify-center rounded-4xl bg-orange-500 text-[15px] text-white">
          {quantity}
        </span>
      )}
    </button>
  );
};
