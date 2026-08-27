import type { ComponentPropsWithoutRef } from 'react';

interface QuantityBadgeProps extends Omit<ComponentPropsWithoutRef<'span'>, 'children'> {
  quantity: number;
}

export const QuantityBadge = ({ quantity, className = '', ...props }: QuantityBadgeProps) => {
  return (
    <span
      {...props}
      aria-label={props['aria-label'] ?? `Количество: ${quantity}`}
      className={`grid shrink-0 place-items-center rounded-full border border-white p-0.5 text-[clamp(0.5rem,2vw,0.6rem)] leading-none font-bold text-white tabular-nums ${className}`}
    >
      {quantity}
    </span>
  );
};
