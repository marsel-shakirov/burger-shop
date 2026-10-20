export const PRODUCT_SORT_BY = ['popularity', 'price', 'rating'] as const;
export const PRODUCT_SORT_ORDER = ['desc', 'asc'] as const;
export const PRODUCT_UNIT = ['g', 'ml'] as const;

export type ProductSortBy = (typeof PRODUCT_SORT_BY)[number];
export type ProductSortOrder = (typeof PRODUCT_SORT_ORDER)[number];

export interface ProductSorting {
  sort: ProductSortBy;
  order: ProductSortOrder;
}

export interface ProductsQueryParams {
  menu?: string;
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
  category_id: number;
  imageUrl: string;
  imageSrcSet: string;
  unit: ProductUnit;
}

export interface OpenedFromListState {
  openedFromList: true;
}
