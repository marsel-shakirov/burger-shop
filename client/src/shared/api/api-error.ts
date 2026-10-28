import { readJson } from './read-json';

interface ApiErrorBody {
  message?: string;
  code?: string;
  reasons?: string[];
}

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly reasons?: string[];

  constructor(status: number, { message, code, reasons }: ApiErrorBody = {}) {
    super(message ?? `Request failed with status ${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.reasons = reasons;
  }
}

export const isApiError = (error: unknown): error is ApiError => error instanceof ApiError;

export const isNetworkError = (error: unknown): error is TypeError => error instanceof TypeError;

const isApiErrorBody = (body: unknown): body is ApiErrorBody =>
  typeof body === 'object' && body !== null;

export const createApiError = async (response: Response): Promise<ApiError> => {
  const body = await readJson<unknown>(response).catch(() => undefined);

  return new ApiError(response.status, isApiErrorBody(body) ? body : {});
};
