import { NextResponse } from "next/server";
import {
  getRefreshTokenCookie,
  setAuthCookies,
  clearAuthCookies,
} from "../cookies";

const BACKEND = process.env.NEXT_PUBLIC_API_URL!;

export async function GET() {
  const refreshToken = await getRefreshTokenCookie();

  if (!refreshToken) {
    return NextResponse.json(
      { error: { message: "Not authenticated" } },
      { status: 401 }
    );
  }

  // Step 1: Refresh tokens
  const refreshRes = await fetch(`${BACKEND}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  const refreshJson = await refreshRes.json();

  if (!refreshRes.ok) {
    await clearAuthCookies();
    return NextResponse.json(
      { error: { message: "Session expired" } },
      { status: 401 }
    );
  }

  const { accessToken, refreshToken: newRefreshToken } = refreshJson.data;

  // Step 2: Get user data
  const userRes = await fetch(`${BACKEND}/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const userJson = await userRes.json();

  // Backend /auth/me returns { data: { message, data: user } } — user is nested
  const user = userJson.data?.data ?? userJson.data;

  await setAuthCookies(accessToken, newRefreshToken);

  return NextResponse.json({ data: { accessToken, user } });
}
