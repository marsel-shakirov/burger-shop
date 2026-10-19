import { useFavoriteActions, useIsFavorite } from '@/entities/favorite';
import type { Product } from '@/entities/product';
import { cn } from '@/shared/lib';
import { HeartIcon } from '@/shared/ui/icon';

type Variant = 'product' | 'cart' | 'details';

interface ToggleFavoriteButtonProps {
  variant: Variant;
  product: Product;
  className?: string;
}

const base = {
  button: 'group cursor-pointer rounded-md focus-ring transition-colors duration-150',
  icon: 'transition-colors duration-150 group-aria-pressed:fill-current group-aria-pressed:text-red-600',
};

const styles: Record<Variant, { button: string; icon: string }> = {
  product: {
    button: 'relative pointer-coarse:after:absolute pointer-coarse:after:-inset-2',
    icon: 'size-6 fill-white text-stone-500 group-hover:fill-red-100 group-hover:text-red-600 group-aria-pressed:group-hover:fill-current group-aria-pressed:group-hover:text-red-700',
  },
  cart: {
    button:
      'grid size-7 place-items-center bg-stone-100 hover:bg-stone-200 aria-pressed:bg-red-100 aria-pressed:hover:bg-red-200',
    icon: 'size-5 fill-stone-600 text-stone-600',
  },
  details: {
    button:
      'grid size-14 shrink-0 place-items-center rounded-[14px] bg-stone-100 hover:bg-stone-200 aria-pressed:bg-red-100 aria-pressed:hover:bg-red-200',
    icon: 'size-6.5 fill-white text-stone-600',
  },
};

export const ToggleFavoriteButton = ({
  variant,
  product,
  className,
}: ToggleFavoriteButtonProps) => {
  const { isFavorite } = useIsFavorite(product.id);
  const { toggleFavorite } = useFavoriteActions();

  const s = styles[variant];

  return (
    <button
      onClick={() => toggleFavorite(product.id)}
      type="button"
      className={cn(base.button, s.button, className)}
      aria-label={`В избранное: ${product.name}`}
      aria-pressed={isFavorite}
    >
      <HeartIcon className={cn(base.icon, s.icon)} />
    </button>
  );
};
