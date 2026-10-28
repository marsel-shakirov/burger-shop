import { pluralize } from './pluralize';

export const formatItemsCount = (n: number) =>
  `${n} ${pluralize(n, ['товар', 'товара', 'товаров'])}`;
