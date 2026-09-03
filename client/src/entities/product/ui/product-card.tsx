import type { ReactNode } from 'react';

import { getImageUrl } from '@/shared/lib/get-image-url';

import type { Product } from '../model/product.types';

export interface ProductCardProps {
  product: Product;
  action?: ReactNode;
}

export const ProductCard = ({ product, action }: ProductCardProps) => {
  return (
    <article className="grid grid-cols-2 rounded-xl p-3 shadow-(--shadow-base) transition-shadow duration-300 ease-out hover:shadow-xl min-[375px]:grid-cols-1 md:p-4 lg:p-5">
      <div className="row-span-2 mx-auto aspect-square w-full">
        <img
          width={124}
          height={124}
          src={getImageUrl(product.image.card.path)}
          alt={product.image.alt}
          className="h-auto w-full object-contain"
        />
      </div>

      <div className="flex min-h-15 items-center justify-center text-center text-sm">
        <h3 className="line-clamp-3 leading-5">{product.name}</h3>
      </div>

      <div className="mt-3 flex items-end-safe justify-between">
        <div className="flex flex-col">
          <span className="text-sm/4 opacity-60">{product.gram}&nbsp;г</span>
          <span className="text-base/5 font-extrabold">от&nbsp;{product.price}&nbsp;₽</span>
        </div>
        {action}
      </div>
    </article>
  );
};
