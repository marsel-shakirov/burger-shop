export interface ProfileRow {
  id: string;
  name: string | null;
  phone: string | null;
}

export type ProfileInput = Omit<ProfileRow, 'id'>;
