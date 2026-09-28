import { selectIsFavorite, selectToggleFavorite, useFavoriteStore } from '@/entities/favorite';
import type { Product } from '@/entities/product';
import { HeartIcon } from '@/shared/ui/icon';

interface ToggleFavoriteButtonProps {
  product: Product;
}

export const ToggleFavoriteButton = ({ product }: ToggleFavoriteButtonProps) => {
  const isFavorite = useFavoriteStore(selectIsFavorite(product.id));
  const toggleFavorite = useFavoriteStore(selectToggleFavorite);

  return (
    <button
      onClick={() => toggleFavorite(product.id)}
      type="button"
      className="group cursor-pointer rounded-md focus-ring"
      aria-label={`В избранное: ${product.name}`}
      aria-pressed={isFavorite}
    >
      <HeartIcon
        className={`size-6 transition-colors duration-150 ${
          isFavorite
            ? 'text-red-600 group-hover:text-red-700'
            : 'fill-white text-stone-500 group-hover:fill-red-100 group-hover:text-red-600'
        }`}
      />
    </button>
  );
};
