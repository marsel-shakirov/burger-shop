import { CodedError } from './coded.error.ts';

export class TooManyRequests extends CodedError {
  statusCode = 429;

  constructor() {
    super('Too many requests', 'over_request_rate_limit');
  }
}
