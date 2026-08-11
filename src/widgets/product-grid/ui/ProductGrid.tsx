import { ProductCard } from '@/entities/product';
import { products } from '@/entities/product/model/products.mock';

export const ProductGrid = () => {
  return (
    <section className="py-7.5">
      <h2 className="text-[32px] font-bold">Все бургеры</h2>
      <ul className="grid grid-cols-4 gap-5 pt-3">
        {products.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </section>
  );
};
