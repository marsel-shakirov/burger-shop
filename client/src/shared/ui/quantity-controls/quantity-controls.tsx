import type { ComponentPropsWithoutRef, Ref } from 'react';

import { MinusIcon, PlusIcon, QtyMinusIcon, QtyPlusIcon } from '@/shared/ui/icon';

type Variant = 'outline' | 'solid';

interface QuantityControlsProps extends ComponentPropsWithoutRef<'div'> {
  quantity: number;
  max: number;
  onDecrease: () => void;
  onIncrease: () => void;
  increaseButtonRef?: Ref<HTMLButtonElement>;
  variant?: Variant;
}

const buttonStyles: Record<Variant, string> = {
  outline: 'rounded-md',
  solid: 'grid size-7 place-items-center rounded-[5px] bg-stone-900 text-orange-500',
};

export const QuantityControls = ({
  onDecrease,
  onIncrease,
  quantity,
  max,
  className,
  increaseButtonRef,
  variant = 'outline',
}: QuantityControlsProps) => {
  const isMaxQuantity = quantity >= max;
  const buttonClassName = `cursor-pointer ${buttonStyles[variant]} focus-ring disabled:cursor-not-allowed disabled:opacity-40`;

  return (
    <div
      className={`inline-flex items-center ${className}`}
      role="group"
      aria-label="Изменение количества товара"
    >
      <button
        type="button"
        onClick={onDecrease}
        className={buttonClassName}
        aria-label="Уменьшить количество"
      >
        {variant === 'solid' ? (
          <MinusIcon className="size-3" />
        ) : (
          <QtyMinusIcon className="size-7" />
        )}
      </button>

      <output
        className="min-w-3 text-center text-lg font-extrabold tabular-nums"
        aria-label="Количество товара"
      >
        {quantity}
      </output>

      <button
        ref={increaseButtonRef}
        type="button"
        disabled={isMaxQuantity}
        onClick={onIncrease}
        className={buttonClassName}
        aria-label="Увеличить количество"
      >
        {variant === 'solid' ? <PlusIcon className="size-3" /> : <QtyPlusIcon className="size-7" />}
      </button>
    </div>
  );
};
