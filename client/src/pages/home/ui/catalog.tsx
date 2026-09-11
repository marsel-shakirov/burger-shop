import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router';

import { type ProductSorting, productsQueryOptions } from '@/entities/product';

import { categoriesQueryOptions } from '../api/categories-query-options';
import type { Category } from '../model/category.types';
import { parseSorting } from '../model/parse-sorting';
import { CategoryFilter } from './category-filter';
import { CategoryFilterSkeleton } from './category-filter-skeleton';
import { ProductGrid } from './product-grid';
import { ProductGridSkeleton } from './product-grid-skeleton';
import { ProductSortMenu } from './product-sort-menu';

const ALL_CATEGORY: Category = {
  id: 'all',
  slug: 'all',
  name: 'Все',
};
const DEFAULT_PRODUCT_GRID_TITLE: string = 'Все бургеры';

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
