import { CodedError } from './coded.error.ts';

export class BadRequest extends CodedError {
  statusCode = 400;

  constructor(message = 'Bad request', code?: string) {
    super(message, code);
  }
}
