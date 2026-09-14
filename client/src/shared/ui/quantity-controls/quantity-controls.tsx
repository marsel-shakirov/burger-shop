import type { ComponentPropsWithoutRef } from 'react';

import { QtyMinusIcon, QtyPlusIcon } from '@/shared/ui/icon';

interface QuantityControlsProps extends ComponentPropsWithoutRef<'div'> {
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
  className,
}: QuantityControlsProps) => {
  const isMaxQuantity = quantity >= max;

  return (
    <div
      className={`inline-flex items-center ${className}`}
      role="group"
      aria-label="Изменение количества товара"
    >
      <button
        type="button"
        onClick={onDecrease}
        className="cursor-pointer rounded-md outline-0 focus-visible:text-amber-800 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Уменьшить количество"
      >
        <QtyMinusIcon className="size-7" />
      </button>

      <output className="min-w-3 text-center text-lg font-extrabold" aria-label="Количество товара">
        {quantity}
      </output>

      <button
        type="button"
        disabled={isMaxQuantity}
        onClick={onIncrease}
        className="cursor-pointer rounded-md outline-0 focus-visible:text-amber-800 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Увеличить количество"
      >
        <QtyPlusIcon className="size-7" />
      </button>
    </div>
  );
};
