export type ProductSort = 'popularity' | 'price' | 'rating';

export interface ProductsQuery {
  categoryId?: string;
  sortBy: ProductSort;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  gram: number;
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
