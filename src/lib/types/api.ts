/**
 * Shared API response and request types.
 */

export type ApiSuccessResponse<T = Record<string, unknown>> = {
  success: true;
  message?: string;
  data?: T;
  redirect?: string;
};

export type ApiErrorResponse = {
  success: false;
  error: string;
  message?: string;
  details?: Record<string, string[]>;
};

export type LoginRequestBody = {
  password?: unknown;
};

export type LoginResponse = ApiSuccessResponse<never> | ApiErrorResponse;

export type VolunteerResponse = ApiSuccessResponse<{ id: number }> | ApiErrorResponse;

export type ContactResponse = ApiSuccessResponse<{ id: number }> | ApiErrorResponse;
