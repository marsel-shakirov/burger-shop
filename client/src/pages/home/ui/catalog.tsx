import { useQuery } from '@tanstack/react-query';

import { menusQueryOptions } from '@/entities/menu';
import { productsQueryOptions } from '@/entities/product';
import { ProductGrid, ProductGridSkeleton } from '@/widgets/product-grid';

import { ALL_CATEGORY } from '../model/catalog.constants';
import { useCatalogParams } from '../model/use-catalog-params';
import { CatalogFilters } from './catalog-filters';
import { CatalogHeader } from './catalog-header';

export const Catalog = () => {
  const { menuSlug, categorySlug, sorting, selectMenu, selectCategory, changeSorting } =
    useCatalogParams();

  const { data: menus = [] } = useQuery(menusQueryOptions());

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
  const productGridTitle =
    activeMenu?.categories.find((category) => category.slug === categorySlug)?.name ??
    (activeMenu ? `Все ${activeMenu.name.toLowerCase()}` : 'Все');

  return (
    <>
      <CatalogFilters
        menuSlug={menuSlug}
        categorySlug={categorySlug ?? ALL_CATEGORY.slug}
        onMenuChange={selectMenu}
        onCategoryChange={selectCategory}
      />
      {isProductsPending ? (
        <ProductGridSkeleton />
      ) : isProductsError ? (
        <div>Failed to load products</div>
      ) : (
        <section className="py-5 sm:py-8">
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
