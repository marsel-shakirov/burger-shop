import type { ImgHTMLAttributes } from 'react';

type ImagePriorityProps = Pick<ImgHTMLAttributes<HTMLImageElement>, 'loading' | 'fetchPriority'>;

export const getImagePriorityProps = (priority: boolean): ImagePriorityProps =>
  priority
    ? { loading: 'eager', fetchPriority: 'high' }
    : { loading: 'lazy', fetchPriority: 'auto' };
