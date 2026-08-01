import axios from "axios";

/**
 * Auth API service — calls Next.js BFF routes exclusively.
 * Uses bare axios (not apiClient) to avoid interceptor loops on refresh calls.
 * All URLs are relative — BFF routes live on the same origin.
 */
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    axios.post("/api/auth/login", credentials),

  signup: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: "instructor" | "student" | "parent";
  }) => axios.post("/api/auth/signup", data),

  refresh: () => axios.post("/api/auth/refresh"),

  logout: () => axios.post("/api/auth/logout"),

  getSession: () => axios.get("/api/auth/session"),
};
