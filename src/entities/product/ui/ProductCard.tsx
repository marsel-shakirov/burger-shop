import { PlusIcon } from '@/shared/ui/icon';

import type { Product } from '../model/product.types';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
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
        <button className="inline-flex cursor-pointer items-center gap-x-1.5 rounded-4xl border border-orange-500 bg-transparent px-2 py-2 font-bold text-orange-500">
          <PlusIcon className="h-3 w-3" />
          <span className="">Добавить</span>
          <span className="flex shrink-0 basis-6 items-center justify-center rounded-4xl bg-orange-500 text-white">
            3
          </span>
        </button>
      </div>
    </article>
  );
};
