import { useQuery } from '@tanstack/react-query';

import {
  type Category,
  CategoryFilter,
  CategoryFilterSkeleton,
  menusQueryOptions,
  MenuTabs,
  MenuTabsSkeleton,
} from '@/entities/menu';
import { productsQueryOptions } from '@/entities/product';

import { ALL_CATEGORY } from '../model/catalog.constants';
import { useCatalogParams } from '../model/use-catalog-params';
import { ProductGrid } from './product-grid';
import { ProductGridSkeleton } from './product-grid-skeleton';
import { ProductSortMenu } from './product-sort-menu';

export const Catalog = () => {
  const { menuSlug, categorySlug, sorting, selectMenu, selectCategory, changeSorting } =
    useCatalogParams();

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
        <MenuTabsSkeleton />
      ) : isMenusError ? null : (
        <MenuTabs menus={menus} selectedMenuSlug={menuSlug} onChange={selectMenu} />
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
            onChange={selectCategory}
          />
        )}

        <ProductSortMenu sorting={sorting} onChange={changeSorting} />
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
