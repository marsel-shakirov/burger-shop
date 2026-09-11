import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router';

import {
  PRODUCT_SORT_BY,
  PRODUCT_SORT_ORDER,
  type ProductSorting,
  productsQueryOptions,
} from '@/entities/product';
import { isOneOf } from '@/shared/lib/is-one-of';

import { categoriesQueryOptions } from '../api/categoriesQueryOptions';
import type { Category } from '../model/catalog.types';
import { CategoryFilter } from './category-filter';
import { CategoryFilterSkeleton } from './category-filter-skeleton';
import { ProductGrid } from './product-grid';
import { ProductGridSkeleton } from './product-grid-skeleton';
import { ProductSortMenu } from './product-sort-menu';

const DEFAULT_SORTING: ProductSorting = { sort: 'rating', order: 'desc' };
const ALL_CATEGORY: Category = {
  id: 'all',
  slug: 'all',
  name: 'Все',
};
const DEFAULT_PRODUCT_GRID_TITLE: string = 'Все бургеры';

const parseSorting = (searchParams: URLSearchParams): ProductSorting => {
  const sort = searchParams.get('sort');
  const order = searchParams.get('order');

  return {
    sort: isOneOf(PRODUCT_SORT_BY, sort) ? sort : DEFAULT_SORTING.sort,
    order: isOneOf(PRODUCT_SORT_ORDER, order) ? order : DEFAULT_SORTING.order,
  };
};

export const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categorySlug = searchParams.get('category') ?? undefined;
  const sorting = parseSorting(searchParams);

  const activeCategory = categorySlug ?? ALL_CATEGORY.slug;

  const handleSelectedCategory = (categorySlug: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (categorySlug === ALL_CATEGORY.slug) {
          next.delete('category');
        } else {
          next.set('category', categorySlug);
        }
        return next;
      },
      { replace: true },
    );
  };

  const handleSortChange = (nextSorting: ProductSorting) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('sort', nextSorting.sort);
        next.set('order', nextSorting.order);
        return next;
      },
      { replace: true },
    );
  };

  const {
    isError: isProductsError,
    isPending: isProductsPending,
    data: products,
  } = useQuery(productsQueryOptions({ sorting, category: categorySlug }));

  const {
    isError: isCategoriesError,
    isPending: isCategoriesPending,
    data: categories = [],
  } = useQuery(categoriesQueryOptions());

  const categoryOptions: Category[] = [ALL_CATEGORY, ...categories];

  const productGridTitle: string =
    categories.find((category) => category.slug === categorySlug)?.name ??
    DEFAULT_PRODUCT_GRID_TITLE;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3 pt-2.5 sm:gap-y-6 sm:pt-5">
        {isCategoriesPending ? (
          <CategoryFilterSkeleton />
        ) : isCategoriesError ? (
          <div>Failed to load categories</div>
        ) : (
          <CategoryFilter
            categories={categoryOptions}
            selectedCategorySlug={activeCategory}
            onClick={handleSelectedCategory}
          />
        )}

        <ProductSortMenu sorting={sorting} onChange={handleSortChange} />
      </div>
      {isProductsPending ? (
        <ProductGridSkeleton />
      ) : isProductsError ? (
        <div>Failed to load products</div>
      ) : (
        <ProductGrid title={productGridTitle} products={products} />
      )}
    </>
  );
};
