import type { ReactNode } from 'react';

import type { Product } from '../model/product.types';

interface ProductCardProps {
  product: Product;
  action?: ReactNode;
}

export const ProductCard = ({ product, action }: ProductCardProps) => {
  return (
    <article className="cursor-pointer rounded-xl p-5 shadow-(--shadow-base) transition-shadow duration-300 ease-out hover:shadow-xl">
      <picture>
        {product.image.webp && <source srcSet={product.image.webp} type="image/webp" />}

        <img width={243} height={243} src={product.image.png} alt={product.description} />
      </picture>

      <div className="flex min-h-15 items-center justify-center text-center text-[17px]">
        <h3 className="line-clamp-3 leading-5">{product.name}</h3>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-sm/3.25">{product.gram}&nbsp;г</span>
          <span className="text-lg/5 font-extrabold">от {product.price}&nbsp;₽</span>
        </div>
        {action}
      </div>
    </article>
  );
};
