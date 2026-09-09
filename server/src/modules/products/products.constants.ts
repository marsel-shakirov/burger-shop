export const PRODUCT_SORT_COLUMNS = {
  popularity: 'popularity',
  price: 'price',
  rating: 'rating',
} as const;

const STORAGE_BUCKET = 'product-images';

export const SUPABASE_STORAGE_URL = `${process.env.SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}`;
