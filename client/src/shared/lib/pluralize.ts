type PluralForms = readonly [one: string, few: string, many: string];

const rules = new Intl.PluralRules('ru');

export function pluralize(n: number, [one, few, many]: PluralForms): string {
  switch (rules.select(n)) {
    case 'one':
      return one;
    case 'many':
      return many;
    default:
      return few;
  }
}
