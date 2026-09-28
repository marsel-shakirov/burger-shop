import { type Product, ProductCard } from '@/entities/product';
import { AddToCartButton } from '@/features/add-to-cart';

interface ProductGridProps {
  products?: Product[];
  isUpdating?: boolean;
}

export const ProductGrid = ({ products, isUpdating = false }: ProductGridProps) => {
  return (
    <ul
      aria-busy={isUpdating}
      className="grid grid-cols-2 gap-2.5 pt-3 transition-opacity aria-busy:opacity-50 aria-busy:delay-150 xs:grid-cols-3 md:pt-5 lg:grid-cols-4"
    >
      {products?.map((product, index) => (
        <li key={product.id}>
          <ProductCard
            product={product}
            priority={index < 5}
            action={<AddToCartButton product={product} />}
          />
        </li>
      ))}
    </ul>
  );
};
