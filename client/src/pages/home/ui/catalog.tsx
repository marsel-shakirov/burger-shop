import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import type { ProductSort } from '@/entities/product';
import { productsQueryOptions } from '@/entities/product';

import { ALL_CATEGORY } from '../model/category.constants';
import { CategoryFilter } from './category-filter';
import { ProductGrid } from './product-grid';
import { ProductSortMenu } from './product-sort-menu';

export const Catalog = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(ALL_CATEGORY.id);

  const [sortBy, setSortBy] = useState<ProductSort>('popularity');

  const categoryId = selectedCategoryId === ALL_CATEGORY.id ? undefined : selectedCategoryId;

  const { isPending, isError, data } = useQuery(productsQueryOptions({ categoryId, sortBy }));

  if (isPending) {
    return <div>loading</div>;
  }

  if (isError) {
    return <div>Failed to load products</div>;
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3 pt-2.5 sm:gap-y-6 sm:pt-5">
        <CategoryFilter selectedCategoryId={selectedCategoryId} onClick={setSelectedCategoryId} />
        <ProductSortMenu sortBy={sortBy} onChange={setSortBy} />
      </div>
      <ProductGrid products={data} />
    </>
  );
};
