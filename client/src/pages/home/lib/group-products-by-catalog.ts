import type { Menu } from '@/entities/menu';
import type { Product } from '@/entities/product';

import type { CatalogMenuGroup } from '../model/catalog.types';

const groupByCategoryId = (products: Product[]) => {
  const productsByCategoryId = new Map<number, Product[]>();

  for (const product of products) {
    const categoryProducts = productsByCategoryId.get(product.categoryId);
    if (categoryProducts) categoryProducts.push(product);
    else productsByCategoryId.set(product.categoryId, [product]);
  }

  return productsByCategoryId;
};

export const groupProductsByCatalog = (menus: Menu[], products: Product[]): CatalogMenuGroup[] => {
  const productsByCategoryId = groupByCategoryId(products);

  return menus
    .map((menu) => ({
      menu,
      categories: menu.categories
        .map((category) => ({ category, products: productsByCategoryId.get(category.id) ?? [] }))
        .filter(({ products }) => products.length > 0),
    }))
    .filter(({ categories }) => categories.length > 0);
};
