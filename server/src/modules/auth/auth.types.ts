export interface SessionUser {
  id: string;
  email: string | null;
}

export type EmailChangeStatus = 'changed' | 'confirm_other' | 'failed';
