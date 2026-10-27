import { type Product, ProductCard } from '@/entities/product';
import { AddToCartButton } from '@/features/add-to-cart';
import { ToggleFavoriteButton } from '@/features/toggle-favorite';

interface ProductGridProps {
  products?: Product[];
}

export const ProductGrid = ({ products }: ProductGridProps) => {
  return (
    <ul className="grid grid-cols-2 gap-2.5 pt-6 xs:grid-cols-3 md:pt-8 lg:grid-cols-4">
      {products?.map((product, index) => (
        <li key={product.id}>
          <ProductCard
            product={product}
            priority={index < 4}
            favoriteAction={<ToggleFavoriteButton variant="product" product={product} />}
            cartAction={<AddToCartButton product={product} />}
          />
        </li>
      ))}
    </ul>
  );
};
