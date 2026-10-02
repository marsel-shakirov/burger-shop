import type { ReactNode } from 'react';
import { Link } from 'react-router';

import { RatingStarIcon } from '@/shared/ui/icon';

import { useProductDetailsLink } from '../lib/product-details-link';
import { PRODUCT_UNIT_LABEL } from '../model/product.constants';
import type { Product } from '../model/product.types';
export interface ProductCardProps {
  product: Product;
  priority: boolean;
  favoriteAction: ReactNode;
  cartAction: ReactNode;
}

export const ProductCard = ({
  product,
  priority,
  favoriteAction,
  cartAction,
}: ProductCardProps) => {
  const detailsLink = useProductDetailsLink(product.id);

  return (
    <article className="relative flex h-full flex-col rounded-xl bg-white p-2 shadow-(--shadow-base) md:p-4 lg:p-5">
      <div className="flex justify-between">
        <div className="flex items-center gap-x-1">
          <RatingStarIcon className="size-3 text-yellow-400" />
          <span className="text-sm font-bold opacity-60">{product.rating}</span>
        </div>
        <div className="relative z-10 flex">{favoriteAction}</div>
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
          <Link
            {...detailsLink}
            className="outline-none after:absolute after:inset-0 after:rounded-xl focus-visible:underline focus-visible:decoration-1 focus-visible:underline-offset-2 focus-visible:after:ring-2 focus-visible:after:ring-amber-600 focus-visible:after:ring-offset-2"
          >
            {product.name}
          </Link>
        </h3>
        <p className="line-clamp-2 text-xs leading-4 text-stone-500 xs:text-sm">
          {product.description}
        </p>
      </div>

      <div className="mt-2 flex flex-col gap-y-1.5">
        <span className="text-xs font-bold text-stone-600">
          {`${product.amount} ${PRODUCT_UNIT_LABEL[product.unit]}`}
        </span>
        <div className="relative z-10">{cartAction}</div>
      </div>
    </article>
  );
};
