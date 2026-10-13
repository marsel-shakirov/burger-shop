import type { ComponentPropsWithoutRef, ReactElement, Ref } from 'react';

import { cn } from '@/shared/lib';
import { MinusIcon, PlusIcon } from '@/shared/ui/icon';

type Variant = 'solid' | 'solid-large' | 'soft';

interface QuantityControlsProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
  itemName: string;
  quantity: number;
  min: number;
  max: number;
  onDecrease: () => void;
  onIncrease: () => void;
  increaseButtonRef?: Ref<HTMLButtonElement>;
  variant: Variant;
  label?: ReactElement | string;
}

const base = {
  root: 'inline-flex items-center',
  button:
    'grid cursor-pointer place-items-center focus-ring transition-colors duration-150 aria-disabled:cursor-not-allowed aria-disabled:opacity-40',
  value: 'min-w-3 text-center text-lg font-extrabold tabular-nums',
};

const styles: Record<Variant, { button: string }> = {
  solid: {
    button:
      'size-7 rounded-[5px] bg-stone-900 text-orange-500 not-aria-disabled:hover:bg-stone-700',
  },
  'solid-large': {
    button:
      'size-11 rounded-[10px] bg-stone-900 text-orange-500 not-aria-disabled:hover:bg-stone-700',
  },
  soft: {
    button: 'size-7 rounded-full text-stone-900 not-aria-disabled:hover:bg-white',
  },
};

export const QuantityControls = ({
  onDecrease,
  onIncrease,
  itemName,
  quantity,
  min,
  max,
  className,
  increaseButtonRef,
  variant,
  label,
  ...props
}: QuantityControlsProps) => {
  const isMaxQuantity = quantity >= max;
  const buttonClassName = cn(base.button, styles[variant].button);

  return (
    <div
      {...props}
      className={cn(base.root, className)}
      role="group"
      aria-label={`Изменение количества: ${itemName}`}
    >
      <button
        type="button"
        onClick={onDecrease}
        className={buttonClassName}
        aria-label={quantity <= min ? `Удалить: ${itemName}` : `Уменьшить количество: ${itemName}`}
      >
        <MinusIcon className="size-3" />
      </button>

      <output
        className={base.value}
        aria-label={label === undefined ? 'Количество товара' : undefined}
      >
        {label ?? quantity}
      </output>

      <button
        ref={increaseButtonRef}
        type="button"
        aria-disabled={isMaxQuantity}
        onClick={isMaxQuantity ? undefined : onIncrease}
        className={buttonClassName}
        aria-label={
          isMaxQuantity
            ? `Увеличить количество: ${itemName}, максимум ${max} шт`
            : `Увеличить количество: ${itemName}`
        }
      >
        <PlusIcon className="size-3" />
      </button>
    </div>
  );
};
