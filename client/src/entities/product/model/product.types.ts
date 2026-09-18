import type { PRODUCT_SORT_BY, PRODUCT_SORT_ORDER, PRODUCT_UNIT } from './product.constants';

export type ProductSortBy = (typeof PRODUCT_SORT_BY)[number];
export type ProductSortOrder = (typeof PRODUCT_SORT_ORDER)[number];

export interface ProductSorting {
  sort: ProductSortBy;
  order: ProductSortOrder;
}

export interface ProductsQueryParams {
  menu: string;
  sorting: ProductSorting;
  category?: string;
}

export type ProductUnit = (typeof PRODUCT_UNIT)[number];

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  amount: number;
  rating: number;
  popularity: number;
  imageUrl: string;
  unit: ProductUnit;
}
