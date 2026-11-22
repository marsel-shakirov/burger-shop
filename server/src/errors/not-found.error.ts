import { CodedError } from './coded.error.ts';

export class NotFound extends CodedError {
  statusCode = 404;

  constructor(message = 'Not found', code?: string) {
    super(message, code);
  }
}
