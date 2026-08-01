import { NextResponse } from "next/server";
import {
  getRefreshTokenCookie,
  setAuthCookies,
  clearAuthCookies,
} from "../cookies";

const BACKEND = process.env.NEXT_PUBLIC_API_URL!;

export async function POST() {
  const refreshToken = await getRefreshTokenCookie();

  if (!refreshToken) {
    return NextResponse.json(
      { error: { message: "No refresh token" } },
      { status: 401 }
    );
  }

  const res = await fetch(`${BACKEND}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  const json = await res.json();

  if (!res.ok) {
    await clearAuthCookies();
    return NextResponse.json(json, { status: res.status });
  }

  const { accessToken, refreshToken: newRefreshToken } = json.data;
  await setAuthCookies(accessToken, newRefreshToken);

  return NextResponse.json({ data: { accessToken } });
}
