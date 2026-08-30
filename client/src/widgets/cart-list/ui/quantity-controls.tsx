import { QtyMinusIcon, QtyPlusIcon } from '@/shared/ui/icon';

interface QuantityControlsProps {
  quantity: number;
  max: number;
  onDecrease: () => void;
  onIncrease: () => void;
}

export const QuantityControls = ({
  onDecrease,
  onIncrease,
  quantity,
  max,
}: QuantityControlsProps) => {
  const isMaxQuantity = quantity >= max;

  return (
    <div
      className="inline-flex items-center gap-x-2 md:gap-x-5"
      role="group"
      aria-label="Изменение количества товара"
    >
      <button
        type="button"
        onClick={onDecrease}
        className="cursor-pointer disabled:opacity-40"
        aria-label="Уменьшить количество"
      >
        <QtyMinusIcon className="size-7 text-orange-500 md:size-9" />
      </button>

      <output
        className="min-w-3 text-center font-bold md:text-xl"
        aria-label="Количество товара"
        aria-live="polite"
      >
        {quantity}
      </output>

      <button
        type="button"
        disabled={isMaxQuantity}
        onClick={onIncrease}
        className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Увеличить количество"
      >
        <QtyPlusIcon className="size-7 text-orange-500 md:size-9" />
      </button>
    </div>
  );
};
