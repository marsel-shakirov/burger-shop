import { ProductCard } from '@/entities/product';
import type { Product } from '@/entities/product/model/product.types';
import { AddToCartButton } from '@/features/add-to-cart';

interface ProductGridProps {
  products?: Product[];
}

export const ProductGrid = ({ products = [] }: ProductGridProps) => {
  return (
    <section className="py-5">
      <h2 className="text-base font-bold sm:text-xl">Все бургеры</h2>
      <ul className="grid gap-5 pt-3 pb-10 min-[375px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} action={<AddToCartButton product={product} />} />
          </li>
        ))}
      </ul>
    </section>
  );
};
