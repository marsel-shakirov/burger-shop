import {
  PRODUCT_IMAGE_FALLBACK_WIDTH,
  PRODUCT_IMAGE_WIDTHS,
  SUPABASE_STORAGE_URL,
} from './products.constants.ts';
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

function toImageUrl(imagePath: string, width: number) {
  return `${SUPABASE_STORAGE_URL}/${width}/${imagePath}.webp`;
}

export function toProductImage(imagePath: string) {
  return {
    imageUrl: toImageUrl(imagePath, PRODUCT_IMAGE_FALLBACK_WIDTH),
    imageSrcSet: PRODUCT_IMAGE_WIDTHS.map(
      (width) => `${toImageUrl(imagePath, width)} ${width}w`,
    ).join(', '),
  };
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
