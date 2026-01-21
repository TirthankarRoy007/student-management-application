import api from "./axios";
import type {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  SuccessResponse,
  User,
} from "../types/auth";

export const login = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/login", credentials);
  return response.data;
};

export const register = async (
  credentials: RegisterCredentials
): Promise<SuccessResponse> => {
  const response = await api.post<SuccessResponse>("/auth/register", credentials);
  return response.data;
};

export const forgotPassword = async (email: string): Promise<SuccessResponse> => {
  // Assuming the backend returns { message: "Token sent to email!" } which is compatible with SuccessResponse if we map it or if backend returns similar structure.
  // Actually backend returns { message: "..." }. I should probably check the type.
  // But wait, my SuccessResponse is { success: boolean }.
  // The backend forgotPassword controller returns: res.json(result); where result is { message: "Token sent to email!" }
  // So it doesn't match SuccessResponse exactly.
  // I will just return any for now or update the type.
  await api.post<{ message: string }>("/auth/forgotPassword", { email });
  return { success: true }; 
};

export const resetPassword = async (token: string, password: string): Promise<SuccessResponse> => {
  // The backend returns { success: true }
  const response = await api.post<SuccessResponse>(`/auth/resetPassword/${token}`, { password });
  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};

export const getCurrentUser = async (): Promise<AuthResponse["user"]> => {
  const response = await api.get<AuthResponse["user"]>("/auth/me");
  return response.data;
};

export const getStudents = async (): Promise<User[]> => {
  const response = await api.get<User[]>("/users/students");
  return response.data;
};

export const updateUser = async (data: Partial<User>): Promise<User> => {
    // Calling the new user endpoint
    const response = await api.put<User>("/users/me", data);
    return response.data;
};
