import type { ReactNode } from 'react';
import { useState } from 'react';

import { HeartIcon, RatingStarIcon } from '@/shared/ui/icon';

import type { Product } from '../model/product.types';
export interface ProductCardProps {
  product: Product;
  priority: boolean;
  action: ReactNode;
}

const UNIT_LABEL = { g: 'г', ml: 'мл' } as const;

export const ProductCard = ({ product, priority, action }: ProductCardProps) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  return (
    <article className="relative flex h-full flex-col rounded-xl bg-white p-2 shadow-(--shadow-base) md:p-4 lg:p-5">
      <div className="flex justify-between">
        <div className="flex items-center gap-x-1">
          <RatingStarIcon className="size-3 text-yellow-400" />
          <span className="text-sm font-bold opacity-60">{product.rating}</span>
        </div>
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          type="button"
          className="group cursor-pointer rounded-md focus-ring"
          aria-label="В избранное"
          aria-pressed={isFavorite}
        >
          <HeartIcon
            className={`size-6 transition-colors duration-150 ${
              isFavorite
                ? 'text-red-600 group-hover:text-red-700'
                : 'fill-white text-stone-500 group-hover:fill-red-100 group-hover:text-red-600'
            }`}
          />
        </button>
      </div>
      <div className="mx-auto aspect-square w-full">
        <img
          width={124}
          height={124}
          src={product.imageUrl}
          alt=""
          className="h-auto w-full object-contain"
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
        />
      </div>

      <div className="flex grow flex-col gap-y-1.5">
        <h3 className="line-clamp-3 text-sm leading-tight font-bold xs:text-base">
          {product.name}
        </h3>
        <p className="line-clamp-2 text-xs leading-4 text-stone-500 xs:text-sm">
          {product.description}
        </p>
      </div>

      <div className="mt-2 flex flex-col gap-y-1.5">
        <span className="text-sm/4 font-bold text-stone-600">
          {`${product.amount} ${UNIT_LABEL[product.unit]}`}
        </span>
        {action}
      </div>
    </article>
  );
};
