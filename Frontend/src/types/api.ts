import { AxiosError } from 'axios';
import type { ApiError } from './auth';
// import { ApiError } from './auth';

export type ApiResponse<T> = {
  data: T;
  message?: string;
  success: boolean;
};

export type CustomAxiosError = AxiosError<ApiError>;