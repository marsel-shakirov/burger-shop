import { pluralize } from '@/shared/lib';

export const formatBonusUnit = (n: number) => pluralize(n, ['бонус', 'бонуса', 'бонусов']);

export const formatBonusCount = (n: number) => `${n} ${formatBonusUnit(n)}`;
