export const GENDERS = ['female', 'male'] as const;

export type Gender = (typeof GENDERS)[number];

export interface Profile {
  name: string | null;
  phone: string | null;
  birthDate: string | null;
  gender: Gender | null;
}
