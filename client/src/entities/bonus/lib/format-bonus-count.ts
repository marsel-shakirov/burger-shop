const rules = new Intl.PluralRules('ru');
const forms = { one: 'бонус', few: 'бонуса', many: 'бонусов', other: 'бонуса' };
export const formatBonusCount = (n: number) =>
  `${n} ${forms[rules.select(n) as keyof typeof forms]}`;
