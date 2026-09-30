import { type Product, ProductCard } from '@/entities/product';
import { AddToCartButton } from '@/features/add-to-cart';
import { ToggleFavoriteButton } from '@/features/toggle-favorite';

interface ProductGridProps {
  products?: Product[];
  isUpdating?: boolean;
}

export const ProductGrid = ({ products, isUpdating = false }: ProductGridProps) => {
  return (
    <ul
      aria-busy={isUpdating}
      className="grid grid-cols-2 gap-2.5 pt-4 transition-opacity aria-busy:opacity-50 aria-busy:delay-150 xs:grid-cols-3 md:pt-5 lg:grid-cols-4"
    >
      {products?.map((product, index) => (
        <li key={product.id}>
          <ProductCard
            product={product}
            priority={index < 4}
            favoriteAction={<ToggleFavoriteButton variant="product" product={product} />}
            action={<AddToCartButton product={product} />}
          />
        </li>
      ))}
    </ul>
  );
};
