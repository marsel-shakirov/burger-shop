import { SUPABASE_STORAGE_URL } from './products.constants.ts';

interface ProductRow {
  id: number;
  name: string;
  desc: string;
  price: number;
  rating: number;
  popularity: number;
  category_id: number;
  image_path: string;
}

export function toProductResponse(product: ProductRow) {
  const { image_path, ...rest } = product;

  return {
    ...rest,
    imageUrl: `${SUPABASE_STORAGE_URL}/${image_path}.webp`,
  };
}
