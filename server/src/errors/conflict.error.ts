import { CodedError } from './coded.error.ts';

export class Conflict extends CodedError {
  statusCode = 409;

  constructor(message = 'Conflict', code?: string) {
    super(message, code);
  }
}
