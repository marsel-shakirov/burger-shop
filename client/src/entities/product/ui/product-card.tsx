import type { ReactNode } from 'react';
import { useState } from 'react';

import { HeartIcon, RatingStarIcon } from '@/shared/ui/icon';

import type { Product } from '../model/product.types';
export interface ProductCardProps {
  product: Product;
  action: ReactNode;
}

export const ProductCard = ({ product, action }: ProductCardProps) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  return (
    <article className="relative flex h-full flex-col rounded-xl bg-white p-2 shadow-(--shadow-base) transition-shadow duration-300 ease-out hover:shadow-xl md:p-4 lg:p-5">
      <div className="flex justify-between">
        <div className="flex items-center gap-x-1">
          <RatingStarIcon className="size-3 text-primary" />
          <span className="text-sm/2 font-bold opacity-60">{product.rating}</span>
        </div>
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          type="button"
          className="cursor-pointer rounded-md focus-ring"
        >
          <HeartIcon
            className={`size-6 ${isFavorite ? 'text-red-600' : 'fill-white text-stone-500'}`}
          />
        </button>
      </div>
      <div className="mx-auto aspect-square w-full">
        <img
          width={124}
          height={124}
          src={product.imageUrl}
          alt={product.name}
          className="h-auto w-full object-contain"
        />
      </div>

      <div className="flex grow flex-col gap-y-1.5">
        <h3 className="line-clamp-3 text-sm leading-4 font-bold xs:text-base">{product.name}</h3>
        <p className="line-clamp-2 text-xs leading-4 text-gray-500 xs:text-sm">
          {product.description}
        </p>
      </div>

      <div className="mt-3 flex flex-col gap-y-1.5">
        <div className="flex flex-col">
          <span className="text-sm/4 font-bold text-stone-500 opacity-60">
            {product.gram}&nbsp;г
          </span>
          <span className="text-lg/5 font-extrabold">от&nbsp;{product.price}&nbsp;₽</span>
        </div>
        {action}
      </div>
    </article>
  );
};
