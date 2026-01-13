import api from "./axios";
import type {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
} from "../types/auth";

export const login = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/login", credentials);
  return response.data;
};

export const register = async (
  credentials: RegisterCredentials
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/register", credentials);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};

export const getCurrentUser = async (): Promise<AuthResponse["user"]> => {
  const response = await api.get<{ user: AuthResponse["user"] }>("/auth/me");
  return response.data.user;
};
