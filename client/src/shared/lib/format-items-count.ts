const rules = new Intl.PluralRules('ru');
const forms = { one: 'товар', few: 'товара', many: 'товаров', other: 'товара' };
export const formatItemsCount = (n: number) =>
  `${n} ${forms[rules.select(n) as keyof typeof forms]}`;
