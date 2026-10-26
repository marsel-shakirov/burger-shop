import { isOneOf } from '@/shared/lib';

import { EMAIL_CHANGE_PARAM, EMAIL_CHANGE_STATUSES } from '../config/profile.constants';
import type { EmailChangeStatus } from '../model/email-change.types';

export const parseEmailChangeStatus = (searchParams: URLSearchParams): EmailChangeStatus | null => {
  const status = searchParams.get(EMAIL_CHANGE_PARAM);

  return isOneOf(EMAIL_CHANGE_STATUSES, status) ? status : null;
};
