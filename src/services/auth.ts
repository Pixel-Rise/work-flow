import axiosClient, { publicAxiosClient } from "@/lib/axios";
import type {
  AuthToken,
  LoginData,
} from "@/types/auth";

export async function login(data: LoginData) {
  return await publicAxiosClient.post<AuthToken>("/auth/login", data);
}

export async function refresh(refreshToken: string) {
  return await publicAxiosClient.get<AuthToken>("/auth/refresh", {
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  });
}

export async function logout() {
  return await axiosClient.get("/auth/logout");
}