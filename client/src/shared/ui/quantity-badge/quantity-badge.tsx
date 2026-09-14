import type { ComponentPropsWithoutRef } from 'react';

interface QuantityBadgeProps extends Omit<ComponentPropsWithoutRef<'span'>, 'children'> {
  quantity: number;
}

export const QuantityBadge = ({ quantity, className = '', ...props }: QuantityBadgeProps) => {
  return (
    <span
      {...props}
      role="status"
      aria-label={props['aria-label'] ?? `Количество: ${quantity}`}
      className={`@container grid aspect-square shrink-0 place-items-center rounded-full leading-none font-extrabold text-white tabular-nums ${className}`}
    >
      <span className="text-[60cqi] leading-0">{quantity}</span>
    </span>
  );
};
