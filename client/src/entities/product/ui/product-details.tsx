import type { ReactNode } from 'react';

import { RatingStarIcon } from '@/shared/ui/icon';

import { PRODUCT_UNIT_LABEL } from '../model/product.constants';
import type { Product } from '../model/product.types';

export interface ProductDetailsProps {
  product: Product;
  titleId: string;
  favoriteAction: ReactNode;
  cartAction: ReactNode;
}

export const ProductDetails = ({
  product,
  titleId,
  favoriteAction,
  cartAction,
}: ProductDetailsProps) => {
  return (
    <article className="flex flex-col">
      <div className="relative h-37.5 sm:h-43">
        <img
          width={272}
          height={272}
          src={product.imageUrl}
          alt=""
          className="absolute bottom-1 left-1/2 size-58 -translate-x-1/2 animate-dish-drop object-contain drop-shadow-[0_10px_8px_rgb(0_0_0/0.22)] motion-reduce:animate-none sm:bottom-2 sm:size-68"
        />
      </div>

      <div className="flex items-center gap-x-4 text-sm font-bold sm:text-[0.9375rem]">
        <span className="flex items-center gap-x-1 text-stone-600">
          <RatingStarIcon className="size-3.5 text-yellow-400" />
          <span className="sr-only">Рейтинг</span>
          {product.rating}
        </span>
        <span className="text-stone-500">
          {`${product.amount} ${PRODUCT_UNIT_LABEL[product.unit]}`}
        </span>
      </div>

      <h2
        id={titleId}
        className="mt-2 font-display text-[1.375rem] leading-[1.18] font-extrabold tracking-[-0.01em] text-balance sm:mt-2.5 sm:text-[1.625rem] sm:leading-[1.15]"
      >
        {product.name}
      </h2>

      <p className="mt-2.5 text-[0.9375rem] leading-normal text-stone-600 sm:mt-3 sm:text-base">
        {product.description}
      </p>

      <div className="mt-6 flex gap-x-2.5 sm:mt-7">
        {favoriteAction}
        <div className="grow">{cartAction}</div>
      </div>
    </article>
  );
};
