import { pluralize } from '@/shared/lib';

export const formatBonusCount = (n: number) =>
  `${n} ${pluralize(n, ['бонус', 'бонуса', 'бонусов'])}`;
