export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  role?: "student" | "teacher" | "admin";
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface SuccessResponse {
  success: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "teacher" | "admin";
}