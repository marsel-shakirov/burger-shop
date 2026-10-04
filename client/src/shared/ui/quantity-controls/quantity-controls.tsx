import type { ComponentPropsWithoutRef, ReactElement, Ref } from 'react';

import { cn } from '@/shared/lib';
import { MinusIcon, PlusIcon, QtyMinusIcon, QtyPlusIcon } from '@/shared/ui/icon';

type Variant = 'outline' | 'solid' | 'solid-large' | 'soft';

interface QuantityControlsProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
  quantity: number;
  max: number;
  onDecrease: () => void;
  onIncrease: () => void;
  increaseButtonRef?: Ref<HTMLButtonElement>;
  variant?: Variant;
  label?: ReactElement | string;
}

const buttonStyles: Record<Variant, string> = {
  outline: 'rounded-md',
  solid:
    'grid size-7 place-items-center rounded-[5px] bg-stone-900 text-orange-500 transition-colors duration-150 enabled:hover:bg-stone-700',
  'solid-large':
    'grid size-11 place-items-center rounded-[10px] bg-stone-900 text-orange-500 transition-colors duration-150 enabled:hover:bg-stone-700',
  soft: 'grid size-7 place-items-center rounded-full text-stone-900 transition-colors duration-150 enabled:hover:bg-white',
};

export const QuantityControls = ({
  onDecrease,
  onIncrease,
  quantity,
  max,
  className,
  increaseButtonRef,
  variant = 'outline',
  label,
}: QuantityControlsProps) => {
  const isMaxQuantity = quantity >= max;
  const buttonClassName = `cursor-pointer ${buttonStyles[variant]} focus-ring disabled:cursor-not-allowed disabled:opacity-40`;

  return (
    <div
      className={cn('inline-flex items-center', className)}
      role="group"
      aria-label="Изменение количества товара"
    >
      <button
        type="button"
        onClick={onDecrease}
        className={buttonClassName}
        aria-label="Уменьшить количество"
      >
        {variant === 'outline' ? (
          <QtyMinusIcon className="size-7" />
        ) : (
          <MinusIcon className="size-3" />
        )}
      </button>

      <output
        className="min-w-3 text-center text-lg font-extrabold tabular-nums"
        aria-label={label === undefined ? 'Количество товара' : undefined}
      >
        {label ?? quantity}
      </output>

      <button
        ref={increaseButtonRef}
        type="button"
        disabled={isMaxQuantity}
        onClick={onIncrease}
        className={buttonClassName}
        aria-label="Увеличить количество"
      >
        {variant === 'outline' ? (
          <QtyPlusIcon className="size-7" />
        ) : (
          <PlusIcon className="size-3" />
        )}
      </button>
    </div>
  );
};
