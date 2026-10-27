export const isOneOf = <T extends string>(list: readonly T[], value: unknown): value is T =>
  list.includes(value as T);
