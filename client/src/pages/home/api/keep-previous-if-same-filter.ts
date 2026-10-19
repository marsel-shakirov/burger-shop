import type { Product, ProductsQueryParams } from '@/entities/product';

type ProductsFilter = Pick<ProductsQueryParams, 'menu' | 'category'>;

interface PreviousProductsQuery {
  queryKey: ReadonlyArray<string | ProductsQueryParams>;
}

export const keepPreviousIfSameFilter =
  ({ menu, category }: ProductsFilter) =>
  (previousData: Product[] | undefined, previousQuery: PreviousProductsQuery | undefined) => {
    const previousParams = previousQuery?.queryKey[1];
    if (typeof previousParams !== 'object') return undefined;

    return previousParams.menu === menu && previousParams.category === category
      ? previousData
      : undefined;
  };
