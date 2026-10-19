import { useQuery } from '@tanstack/react-query';

import { menusQueryOptions } from '@/entities/menu';
import { productsQueryOptions } from '@/entities/product';
import { Container } from '@/shared/ui/container';
import { ProductGrid, ProductGridSkeleton } from '@/widgets/product-grid';

import { ALL_CATEGORY } from '../model/catalog.constants';
import { resolveCatalogSelection } from '../model/resolve-catalog-selection';
import { useCatalogParams } from '../model/use-catalog-params';
import { CatalogFilters } from './catalog-filters';
import { CatalogHeader } from './catalog-header';

export const Catalog = () => {
  const {
    menuSlug: requestedMenuSlug,
    categorySlug: requestedCategorySlug,
    sorting,
    selectMenu,
    selectCategory,
    changeSorting,
  } = useCatalogParams();

  const {
    data: menus,
    isSuccess: isMenusSuccess,
    isError: isMenusError,
  } = useQuery(menusQueryOptions());

  const { menuSlug, categorySlug, menu, category } = resolveCatalogSelection(
    menus,
    requestedMenuSlug,
    requestedCategorySlug,
  );

  const {
    isError: isProductsError,
    isPending: isProductsPending,
    isPlaceholderData: isProductsPlaceholder,
    data: products,
  } = useQuery({
    ...productsQueryOptions({ sorting, menu: menuSlug, category: categorySlug }),
    enabled: isMenusSuccess || isMenusError,
    placeholderData: (previousData, previousQuery) => {
      const previousParams = previousQuery?.queryKey[1];
      if (typeof previousParams !== 'object') return undefined;

      return previousParams.menu === menuSlug && previousParams.category === categorySlug
        ? previousData
        : undefined;
    },
  });

  const productGridTitle = category?.name ?? (menu ? `Все ${menu.name.toLowerCase()}` : 'Все');

  return (
    <>
      <CatalogFilters
        menuSlug={menuSlug}
        categorySlug={categorySlug ?? ALL_CATEGORY.slug}
        onMenuChange={selectMenu}
        onCategoryChange={selectCategory}
      />
      <Container>
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
      </Container>
    </>
  );
};
