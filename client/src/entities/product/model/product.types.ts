import { PRODUCT_SORT_BY, PRODUCT_SORT_ORDER } from './product.constants';

export type ProductSortBy = (typeof PRODUCT_SORT_BY)[number];
export type ProductSortOrder = (typeof PRODUCT_SORT_ORDER)[number];

export interface ProductSorting {
  sort: ProductSortBy;
  order: ProductSortOrder;
}

export interface ProductsQueryParams {
  sorting: ProductSorting;
  category?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  gram: number;
  rating: number;
  popularity: number;
  imageUrl: string;
}
