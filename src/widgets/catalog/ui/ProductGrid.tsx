import { ProductCard, productsMock } from '@/entities/product';
import { AddToCartButton } from '@/features/add-to-cart';

export const ProductGrid = () => {
  return (
    <section className="py-7.5">
      <h1 className="text-[32px] font-bold">Все бургеры</h1>
      <ul className="grid grid-cols-4 gap-5 pt-3">
        {productsMock.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} action={<AddToCartButton productId={product.id} />} />
          </li>
        ))}
      </ul>
    </section>
  );
};
