import { type Product, ProductCard } from '@/entities/product';
import { AddToCartButton } from '@/features/add-to-cart';

interface ProductGridProps {
  title: string;
  products?: Product[];
}

export const ProductGrid = ({ title, products }: ProductGridProps) => {
  return (
    <section className="py-4 sm:py-7">
      <h2 className="text-base font-bold sm:text-xl">{title}</h2>
      <ul className="grid grid-cols-2 gap-2.5 pt-3 xs:grid-cols-3 md:pt-5 lg:grid-cols-4">
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
    </section>
  );
};
