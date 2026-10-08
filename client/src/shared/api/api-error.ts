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

export const createApiError = async (response: Response): Promise<ApiError> => {
  const body: ApiErrorBody = await response.json().catch(() => ({}));

  return new ApiError(response.status, body);
};
