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
      className="inline-flex items-center gap-x-3"
      role="group"
      aria-label="Изменение количества товара"
    >
      <button
        type="button"
        onClick={onDecrease}
        className="cursor-pointer disabled:opacity-40"
        aria-label="Уменьшить количество"
      >
        <QtyMinusIcon className="size-8 text-orange-500" />
      </button>

      <output
        className="min-w-6 text-center text-[22px] font-bold"
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
        <QtyPlusIcon className="size-8 text-orange-500" />
      </button>
    </div>
  );
};
