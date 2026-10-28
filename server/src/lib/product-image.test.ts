import { describe, expect, it } from 'vitest';

import { toProductImage } from './product-image.ts';

const STORAGE_URL = 'http://supabase.test/storage/v1/object/public/product-images';

describe('toProductImage', () => {
  it('собирает основную ссылку на картинку шириной 512', () => {
    expect(toProductImage('burgers/classic').imageUrl).toBe(
      `${STORAGE_URL}/512/burgers/classic.webp`,
    );
  });

  it('собирает srcset из всех ширин по возрастанию', () => {
    expect(toProductImage('burgers/classic').imageSrcSet).toBe(
      [
        `${STORAGE_URL}/256/burgers/classic.webp 256w`,
        `${STORAGE_URL}/384/burgers/classic.webp 384w`,
        `${STORAGE_URL}/512/burgers/classic.webp 512w`,
        `${STORAGE_URL}/768/burgers/classic.webp 768w`,
      ].join(', '),
    );
  });
});
