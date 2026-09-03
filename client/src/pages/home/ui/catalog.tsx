import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import type { ProductSorting } from '@/entities/product';
import { productsQueryOptions } from '@/entities/product';

import { getCategories } from '../api/get-categories';
import { ALL_CATEGORY } from '../model/category.constants';
import { CategoryFilter } from './category-filter';
import { CategoryFilterSkeleton } from './category-filter-skeleton';
import { ProductGrid } from './product-grid';
import { ProductGridSkeleton } from './product-grid-skeleton';
import { ProductSortMenu } from './product-sort-menu';

export const Catalog = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(ALL_CATEGORY.id);

  const [sorting, setSorting] = useState<ProductSorting>({ sortBy: 'popularity', orderBy: 'desc' });

  const categoryId = selectedCategoryId === ALL_CATEGORY.id ? undefined : selectedCategoryId;

  const {
    isError: isProductsError,
    isPending: isProductsPending,
    data: products,
  } = useQuery(productsQueryOptions({ categoryId, ...sorting }));

  const {
    isError: isCategoriesError,
    isPending: isCategoriesPending,
    data: categories = [],
  } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 60,
  });

  const categoryOptions = [ALL_CATEGORY, ...categories];
  const selectedCategory =
    categoryOptions.find((category) => category.id === selectedCategoryId) ?? ALL_CATEGORY;
  const productGridTitle =
    selectedCategory.id === ALL_CATEGORY.id ? 'Все бургеры' : selectedCategory.name;

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
            selectedCategoryId={selectedCategoryId}
            onClick={setSelectedCategoryId}
          />
        )}

        <ProductSortMenu sorting={sorting} onChange={setSorting} />
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
