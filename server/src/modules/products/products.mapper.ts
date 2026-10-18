import {
  PRODUCT_IMAGE_FALLBACK_WIDTH,
  PRODUCT_IMAGE_WIDTHS,
  SUPABASE_STORAGE_URL,
} from './products.constants.ts';
import type { ProductRow } from './products.types.ts';

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

export function toProductResponse(product: ProductRow) {
  const { image_path, ...rest } = product;

  return { ...rest, ...toProductImage(image_path) };
}
