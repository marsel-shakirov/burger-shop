import { useCartActions } from '@/entities/cart';
import { DeleteIcon } from '@/shared/ui/icon';

export const ClearCartButton = () => {
  const { clearCart } = useCartActions();

  return (
    <button
      type="button"
      onClick={clearCart}
      className="flex shrink-0 cursor-pointer items-center gap-x-1 rounded-md text-xs font-bold text-stone-500 focus-ring transition-colors duration-150 hover:text-red-600 sm:text-base"
    >
      <DeleteIcon className="size-5" />
      Очистить корзину
    </button>
  );
};
