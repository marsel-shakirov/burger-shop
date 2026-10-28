const STORAGE_BUCKET = 'product-images';

const STORAGE_URL = `${process.env.SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}`;

const IMAGE_WIDTHS = [256, 384, 512, 768] as const;

const IMAGE_FALLBACK_WIDTH = 512;

function toImageUrl(imagePath: string, width: number) {
  return `${STORAGE_URL}/${width}/${imagePath}.webp`;
}

export function toProductImage(imagePath: string) {
  return {
    imageUrl: toImageUrl(imagePath, IMAGE_FALLBACK_WIDTH),
    imageSrcSet: IMAGE_WIDTHS.map((width) => `${toImageUrl(imagePath, width)} ${width}w`).join(
      ', ',
    ),
  };
}
