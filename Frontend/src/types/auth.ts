export type User = {
  id: string;
  email: string;
  name: string;
  role?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export type LoginCredentials = {
  email: string;
  password: string;
}

export type LoginResponse = {
  user: User;
  message?: string;
}

export type ApiError = {
  message: string;
  code?: string;
  statusCode?: number;
}