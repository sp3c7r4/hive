import { cookies } from "next/headers";

export const COOKIE_NAMES = {
  refreshToken: "hive-refresh-token",
  accessToken: "hive-access-token",
} as const;

export const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 7 * 24 * 60 * 60, // 7 days
};

export const ACCESS_COOKIE_OPTIONS = {
  httpOnly: false,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 30 * 60, // 30 minutes
};

export async function setAuthCookies(
  accessToken: string,
  refreshToken: string,
) {
  const jar = await cookies();
  jar.set(COOKIE_NAMES.refreshToken, refreshToken, REFRESH_COOKIE_OPTIONS);
  jar.set(COOKIE_NAMES.accessToken, accessToken, ACCESS_COOKIE_OPTIONS);
}

export async function getRefreshTokenCookie(): Promise<string | undefined> {
  const jar = await cookies();
  return jar.get(COOKIE_NAMES.refreshToken)?.value;
}

export async function clearAuthCookies() {
  const jar = await cookies();
  jar.delete(COOKIE_NAMES.refreshToken);
  jar.delete(COOKIE_NAMES.accessToken);
}
