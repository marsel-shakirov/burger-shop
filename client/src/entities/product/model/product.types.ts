export type ProductSortBy = 'popularity' | 'price' | 'rating';

export type ProductSortOrder = 'asc' | 'desc';

export interface ProductSorting {
  sortBy: ProductSortBy;
  orderBy: ProductSortOrder;
}

export interface ProductsQuery extends ProductSorting {
  categoryId?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  gram: number;
  rating: number;
  popularity: number;
  image: {
    card: {
      path: string;
    };
    cart: {
      path: string;
    };
    alt: string;
  };
}
