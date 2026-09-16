import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router';

import { type ProductSorting, productsQueryOptions } from '@/entities/product';

import { menusQueryOptions } from '../api/menus-query-options';
import type { Category } from '../model/menu.types';
import { parseSorting } from '../model/parse-sorting';
import { CategoryFilter } from './category-filter';
import { CategoryFilterSkeleton } from './category-filter-skeleton';
import { MenuTabs } from './menu-tabs';
import { ProductGrid } from './product-grid';
import { ProductGridSkeleton } from './product-grid-skeleton';
import { ProductSortMenu } from './product-sort-menu';

const ALL_CATEGORY: Category = {
  id: 0,
  slug: 'all',
  name: 'Все',
};
const DEFAULT_MENU_SLUG = 'burgers';

export const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const menuSlug = searchParams.get('menu') ?? DEFAULT_MENU_SLUG;
  const categorySlug = searchParams.get('category') ?? undefined;
  const sorting = parseSorting(searchParams);

  const handleSelectMenu = (nextMenuSlug: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('menu', nextMenuSlug);
        next.delete('category');
        return next;
      },
      { replace: true },
    );
  };

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
    isError: isMenusError,
    isPending: isMenusPending,
    data: menus = [],
  } = useQuery(menusQueryOptions());
  const {
    isError: isProductsError,
    isPending: isProductsPending,
    data: products,
  } = useQuery(productsQueryOptions({ sorting, menu: menuSlug, category: categorySlug }));

  const activeMenu = menus.find((menu) => menu.slug === menuSlug);
  const categories = activeMenu?.categories ?? [];
  const categoryOptions: Category[] = [ALL_CATEGORY, ...categories];

  const productGridTitle =
    categories.find((category) => category.slug === categorySlug)?.name ??
    (activeMenu ? `Все ${activeMenu.name.toLowerCase()}` : 'Все');

  return (
    <>
      {isMenusPending ? (
        <div>Skeleton</div>
      ) : isMenusError ? null : (
        <MenuTabs menus={menus} selectedMenuSlug={menuSlug} onChange={handleSelectMenu} />
      )}

      <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-5 pt-4 sm:gap-y-6 sm:pt-5">
        {isMenusPending ? (
          <CategoryFilterSkeleton />
        ) : isMenusError ? (
          <div>Failed to load categories</div>
        ) : (
          <CategoryFilter
            categories={categoryOptions}
            selectedCategorySlug={categorySlug ?? ALL_CATEGORY.slug}
            onChange={handleSelectedCategory}
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
