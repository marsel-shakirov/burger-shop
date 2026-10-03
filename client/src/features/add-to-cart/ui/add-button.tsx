import type { Ref } from 'react';

import type { Product } from '@/entities/product';
import { formatPrice } from '@/shared/lib';
import { PlusIcon } from '@/shared/ui/icon';

import type { AddToCartVariant } from '../model/add-to-cart.types';

interface AddButtonProps {
  ref?: Ref<HTMLButtonElement>;
  product: Product;
  variant: AddToCartVariant;
  onClick: () => void;
}

const styles: Record<AddToCartVariant, { button: string; price: string; mark: string }> = {
  card: {
    button: 'rounded-md py-1 pr-1 pl-3',
    price: 'text-base',
    mark: 'grid size-7 place-items-center transition-transform duration-200 ease-out group-hover/add:-translate-x-1 motion-reduce:transition-none',
  },
  details: {
    button: 'rounded-[14px] py-1.5 pr-1.5 pl-5',
    price: 'text-xl',
    mark: 'flex h-full w-36 items-center justify-center gap-x-2.5 font-bold',
  },
};

export const AddButton = ({ ref, product, variant, onClick }: AddButtonProps) => {
  const price = formatPrice(product.price);
  const s = styles[variant];

  return (
    <button
      ref={ref}
      type="button"
      aria-label={`Добавить ${product.name} в корзину, ${price}`}
      onClick={onClick}
      className={`relative flex size-full cursor-pointer items-center justify-between text-stone-900 focus-ring ${s.button}`}
    >
      <span className={`font-display font-extrabold tabular-nums ${s.price}`}>{price}</span>
      <span className={s.mark}>
        {variant === 'details' && 'Добавить'}
        <PlusIcon className="size-3" />
      </span>
    </button>
  );
};
