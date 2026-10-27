export type ProductUnit = 'g' | 'ml';

export interface ProductRow {
  id: number;
  name: string;
  description: string;
  price: number;
  amount: number;
  unit: ProductUnit;
  rating: number;
  popularity: number;
  category_id: number;
  image_path: string;
}
