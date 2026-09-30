import { selectIsFavorite, selectToggleFavorite, useFavoriteStore } from '@/entities/favorite';
import type { Product } from '@/entities/product';
import { HeartIcon } from '@/shared/ui/icon';

type Variant = 'product' | 'cart';

interface ToggleFavoriteButtonProps {
  variant: Variant;
  product: Product;
  className?: string;
}

const styles: Record<Variant, { button: string; icon: string }> = {
  product: {
    button: '',
    icon: 'size-6 fill-white text-stone-500 group-hover:fill-red-100 group-hover:text-red-600 group-aria-pressed:fill-current group-aria-pressed:text-red-600 group-aria-pressed:group-hover:fill-current group-aria-pressed:group-hover:text-red-700',
  },
  cart: {
    button:
      'grid size-7 place-items-center bg-stone-100 hover:bg-stone-200 aria-pressed:bg-red-100 aria-pressed:hover:bg-red-200',
    icon: 'size-5 fill-stone-600 text-stone-600 group-aria-pressed:fill-current group-aria-pressed:text-red-600',
  },
};

export const ToggleFavoriteButton = ({
  variant,
  product,
  className = '',
}: ToggleFavoriteButtonProps) => {
  const isFavorite = useFavoriteStore(selectIsFavorite(product.id));
  const toggleFavorite = useFavoriteStore(selectToggleFavorite);

  const s = styles[variant];

  return (
    <button
      onClick={() => toggleFavorite(product.id)}
      type="button"
      className={`group cursor-pointer rounded-md focus-ring transition-colors duration-150 ${s.button} ${className}`}
      aria-label={`В избранное: ${product.name}`}
      aria-pressed={isFavorite}
    >
      <HeartIcon className={`transition-colors duration-150 ${s.icon}`} />
    </button>
  );
};
