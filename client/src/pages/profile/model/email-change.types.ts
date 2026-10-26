import type { EMAIL_CHANGE_STATUSES } from '../config/profile.constants';

export type EmailChangeStatus = (typeof EMAIL_CHANGE_STATUSES)[number];

export interface EmailNotice {
  message: string;
  tone: 'success' | 'error';
}
