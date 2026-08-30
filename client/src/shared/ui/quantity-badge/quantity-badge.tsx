import type { ComponentPropsWithoutRef } from 'react';

interface QuantityBadgeProps extends Omit<ComponentPropsWithoutRef<'span'>, 'children'> {
  quantity: number;
}

export const QuantityBadge = ({ quantity, className = '', ...props }: QuantityBadgeProps) => {
  return (
    <span
      {...props}
      aria-label={props['aria-label'] ?? `Количество: ${quantity}`}
      className={`@container inline-grid aspect-square shrink-0 place-items-center rounded-full border border-white leading-none font-bold text-white tabular-nums ${className}`}
    >
      <span className="text-[50cqi]">{quantity}</span>
    </span>
  );
};
