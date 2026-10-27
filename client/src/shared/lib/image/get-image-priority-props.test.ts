import { describe, expect, it } from 'vitest';

import { getImagePriorityProps } from './get-image-priority-props';

describe('getImagePriorityProps', () => {
  it('грузит приоритетную картинку сразу и с высоким приоритетом', () => {
    expect(getImagePriorityProps(true)).toEqual({ loading: 'eager', fetchPriority: 'high' });
  });

  it('откладывает загрузку обычной картинки', () => {
    expect(getImagePriorityProps(false)).toEqual({ loading: 'lazy', fetchPriority: 'auto' });
  });
});
