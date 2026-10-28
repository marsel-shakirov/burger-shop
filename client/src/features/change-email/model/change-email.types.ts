import type { EMAIL_CHANGE_STATUSES } from '../config/change-email.constants';

export type EmailFormField = 'newEmail' | 'currentPassword';

export interface EmailChange {
  newEmail: string;
  currentPassword: string;
}

export interface EmailFormError {
  message: string;
  field?: EmailFormField;
}

export type EmailChangeStatus = (typeof EMAIL_CHANGE_STATUSES)[number];

export interface EmailNotice {
  message: string;
  tone: 'success' | 'error';
}
