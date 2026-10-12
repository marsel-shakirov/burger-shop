export const PRODUCT_SORT_COLUMNS = {
  popularity: 'popularity',
  price: 'price',
  rating: 'rating',
} as const;

const STORAGE_BUCKET = 'product-images';

export const SUPABASE_STORAGE_URL = `${process.env.SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}`;

export const PRODUCT_IMAGE_WIDTHS = [256, 384, 512, 768] as const;

export const PRODUCT_IMAGE_FALLBACK_WIDTH = 512;
