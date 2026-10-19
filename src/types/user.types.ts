export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  createdAt: string;
}

export interface AuthUserPayload {
  id: string;
  email: string;
}

export type SafeUser = Omit<User, 'passwordHash'>;

export interface AuthResponse {
  user: SafeUser;
  token: string;
}

export interface RegisterDTO {
  email: string;
  password: string;
  name: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

