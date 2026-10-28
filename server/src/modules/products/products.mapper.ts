import { toProductImage } from '../../lib/product-image.ts';
import type { ProductRow, ProductUnit } from './products.types.ts';

export interface ProductResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  amount: number;
  unit: ProductUnit;
  rating: number;
  popularity: number;
  categoryId: number;
  imageUrl: string;
  imageSrcSet: string;
}

export function toProductResponse({
  id,
  name,
  description,
  price,
  amount,
  unit,
  rating,
  popularity,
  category_id,
  image_path,
}: ProductRow): ProductResponse {
  return {
    id,
    name,
    description,
    price,
    amount,
    unit,
    rating,
    popularity,
    categoryId: category_id,
    ...toProductImage(image_path),
  };
}
