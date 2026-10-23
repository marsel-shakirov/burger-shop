import { pluralize } from '@/shared/lib';

export const formatItemsCount = (n: number) =>
  `${n} ${pluralize(n, ['товар', 'товара', 'товаров'])}`;
