import type { ReactNode } from 'react';

import { RatingStarIcon } from '@/shared/ui/icon';

import type { Product } from '../model/product.types';
export interface ProductCardProps {
  product: Product;
  priority: boolean;
  favoriteAction: ReactNode;
  action: ReactNode;
}

const UNIT_LABEL = { g: 'г', ml: 'мл' } as const;

export const ProductCard = ({ product, priority, favoriteAction, action }: ProductCardProps) => {
  return (
    <article className="relative flex h-full flex-col rounded-xl bg-white p-2 shadow-(--shadow-base) md:p-4 lg:p-5">
      <div className="flex justify-between">
        <div className="flex items-center gap-x-1">
          <RatingStarIcon className="size-3 text-yellow-400" />
          <span className="text-sm font-bold opacity-60">{product.rating}</span>
        </div>
        {favoriteAction}
      </div>
      <div className="mx-auto aspect-square w-full">
        <img
          width={194}
          height={194}
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
        <span className="text-xs font-bold text-stone-600">
          {`${product.amount} ${UNIT_LABEL[product.unit]}`}
        </span>
        {action}
      </div>
    </article>
  );
};
