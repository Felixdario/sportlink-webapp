export interface User {
  id: number;
  name: string;
  email: string;
  isEmailVerified: boolean;
  createdAt: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface VerifyEmailData {
  email: string;
  code: string;
}

export interface ResendVerificationData {
  email: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
}

export interface AuthResponse {
  token?: string;
  message: string;
} 