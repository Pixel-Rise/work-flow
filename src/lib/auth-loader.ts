import { redirect } from "react-router-dom";
import { refreshToken } from "@/lib/refresh-token";

export async function authLoader() {
  const accessToken = localStorage.getItem("accessToken");
  const refreshTokenValue = localStorage.getItem("refreshToken");

  // If no tokens exist, redirect to login
  if (!accessToken && !refreshTokenValue) {
    return redirect("/login");
  }

  // If access token exists, user is authenticated
  if (accessToken) {
    return null;
  }

  // If only refresh token exists, try to refresh
  if (refreshTokenValue) {
    try {
      const session = await refreshToken();
      if (session?.accessToken) {
        return null; // Authentication successful
      } else {
        return redirect("/login");
      }
    } catch (error) {
      // Refresh failed, redirect to login
      return redirect("/login");
    }
  }

  // Fallback: redirect to login
  return redirect("/login");
}

export function loginLoader() {
  const accessToken = localStorage.getItem("accessToken");
  
  // If user is already authenticated, redirect to dashboard
  if (accessToken) {
    return redirect("/dashboard");
  }
  
  return null;
}

export function publicLoader() {
  // Public pages are accessible to everyone
  return null;
}
