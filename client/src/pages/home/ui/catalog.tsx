import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { productsQueryOptions } from '@/entities/product';

import { CategoryFilter } from './category-filter';
import { ProductGrid } from './product-grid';
import { SortSelect } from './sort-select';

export const Catalog = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const { isPending, isError, data } = useQuery(productsQueryOptions(activeCategory));

  if (isPending) {
    return <div>loading</div>;
  }

  if (isError) {
    return <div>Failed to load products</div>;
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3 pt-2.5 sm:gap-y-6 sm:pt-5">
        <CategoryFilter activeCategory={activeCategory} onClick={setActiveCategory} />
        <SortSelect />
      </div>
      <ProductGrid products={data} />
    </>
  );
};
