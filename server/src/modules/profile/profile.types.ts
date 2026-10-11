import type { GENDERS } from './profile.constants.ts';

export type Gender = (typeof GENDERS)[number];

export interface ProfileRow {
  id: string;
  name: string | null;
  phone: string | null;
  birth_date: string | null;
  gender: Gender | null;
}

export interface ProfileInput {
  name?: string | null;
  phone?: string | null;
  birthDate?: string | null;
  gender?: Gender | null;
}
