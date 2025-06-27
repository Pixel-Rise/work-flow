import type { AuthToken } from "@/types/auth";
import { publicAxiosClient } from "@/lib/axios";

export async function refreshToken() {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    const res = await publicAxiosClient.get<AuthToken>("/auth/refresh", {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });
    const session = res?.data;
    if (!session?.accessToken) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    } else {
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
    }
    return session;
  } catch (error: unknown) {
    if (isAxiosError(error) && error.response?.status === 403) {
      alert("Your session has expired!");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
    }
  }
}

function isAxiosError(
  error: unknown,
): error is { response: { status: number } } {
  return typeof error === "object" && error !== null && "response" in error;
}