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
import { ProductGrid, ProductGridSkeleton } from '@/widgets/product-grid';

import { ALL_CATEGORY } from '../model/catalog.constants';
import { useCatalogParams } from '../model/use-catalog-params';
import { CatalogHeader } from './catalog-header';

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
    isPlaceholderData: isProductsPlaceholder,
    data: products,
  } = useQuery({
    ...productsQueryOptions({ sorting, menu: menuSlug, category: categorySlug }),
    placeholderData: (previousData, previousQuery) => {
      const previousParams = previousQuery?.queryKey[1];
      if (typeof previousParams !== 'object') return undefined;

      return previousParams.menu === menuSlug && previousParams.category === categorySlug
        ? previousData
        : undefined;
    },
  });

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

      <div className="pt-4 sm:pt-5">
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
      </div>
      {isProductsPending ? (
        <ProductGridSkeleton />
      ) : isProductsError ? (
        <div>Failed to load products</div>
      ) : (
        <section className="py-4 sm:py-7">
          <CatalogHeader
            title={productGridTitle}
            sorting={sorting}
            products={products}
            onSortingChange={changeSorting}
          />
          <ProductGrid products={products} isUpdating={isProductsPlaceholder} />
        </section>
      )}
    </>
  );
};
