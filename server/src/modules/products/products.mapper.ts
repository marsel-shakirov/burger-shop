import { SUPABASE_STORAGE_URL } from './products.constants.ts';
import type { ProductRow } from './products.types.ts';

export function toProductResponse(product: ProductRow) {
  const { image_path, ...rest } = product;

  return {
    ...rest,
    imageUrl: `${SUPABASE_STORAGE_URL}/${image_path}.webp`,
  };
}
