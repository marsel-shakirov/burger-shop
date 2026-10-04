import { selectIsFavorite, selectToggleFavorite, useFavoriteStore } from '@/entities/favorite';
import type { Product } from '@/entities/product';
import { cn } from '@/shared/lib';
import { HeartIcon } from '@/shared/ui/icon';

type Variant = 'product' | 'cart' | 'details';

interface ToggleFavoriteButtonProps {
  variant: Variant;
  product: Product;
  className?: string;
}

const styles: Record<Variant, { button: string; icon: string }> = {
  product: {
    button: 'p-1.5 -m-1.5 -r-1.5 xs:p-0 xs:-m-0 xs:-r-0',
    icon: 'size-6 fill-white text-stone-500 group-hover:fill-red-100 group-hover:text-red-600 group-aria-pressed:fill-current group-aria-pressed:text-red-600 group-aria-pressed:group-hover:fill-current group-aria-pressed:group-hover:text-red-700',
  },
  cart: {
    button:
      'grid size-7 place-items-center bg-stone-100 hover:bg-stone-200 aria-pressed:bg-red-100 aria-pressed:hover:bg-red-200',
    icon: 'size-5 fill-stone-600 text-stone-600 group-aria-pressed:fill-current group-aria-pressed:text-red-600',
  },
  details: {
    button:
      'grid size-14 shrink-0 place-items-center rounded-[14px] bg-stone-100 hover:bg-stone-200 aria-pressed:bg-red-100 aria-pressed:hover:bg-red-200',
    icon: 'size-6.5 fill-white text-stone-600 group-aria-pressed:fill-current group-aria-pressed:text-red-600',
  },
};

export const ToggleFavoriteButton = ({
  variant,
  product,
  className,
}: ToggleFavoriteButtonProps) => {
  const isFavorite = useFavoriteStore(selectIsFavorite(product.id));
  const toggleFavorite = useFavoriteStore(selectToggleFavorite);

  const s = styles[variant];

  return (
    <button
      onClick={() => toggleFavorite(product.id)}
      type="button"
      className={cn(
        'group cursor-pointer rounded-md focus-ring transition-colors duration-150',
        s.button,
        className,
      )}
      aria-label={`В избранное: ${product.name}`}
      aria-pressed={isFavorite}
    >
      <HeartIcon className={cn('transition-colors duration-150', s.icon)} />
    </button>
  );
};
